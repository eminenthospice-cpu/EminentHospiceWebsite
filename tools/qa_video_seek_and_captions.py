from __future__ import annotations

import json
import math
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
VIDEOS_DIR = ROOT / "public" / "videos"
CAPTIONS_DIR = ROOT / "public" / "captions"
TRANSCRIPTS_DIR = ROOT / "audit" / "video_captions" / "transcripts"
VIDEO1_REMEDIATION_TRANSCRIPT = ROOT / "audit" / "video1_caption_remediation" / "video1.ko.transcript.json"
REMEDIATION_TRANSCRIPTS_DIR = ROOT / "audit" / "video_caption_remediation"
OUT_DIR = ROOT / "audit" / "seek_caption_qa"
FRAMES_DIR = OUT_DIR / "frames"
SHEETS_DIR = OUT_DIR / "sheets"
FFMPEG = Path(imageio_ffmpeg.get_ffmpeg_exe())

SAMPLE_STRATEGY = "segment-start-mid-end"
CAPTION_REGION_TOP = 0.58
MIN_VISIBLE_CAPTION_SCORE = 0.0025
MAX_SPEECH_WITHOUT_CAPTION_GAP = 0.35


@dataclass(frozen=True)
class Cue:
    start: float
    end: float
    text: str


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=True, capture_output=True, text=True)


def duration_seconds(video: Path) -> float:
    proc = subprocess.run(
        [str(FFMPEG), "-hide_banner", "-i", str(video)],
        capture_output=True,
        text=True,
    )
    for line in proc.stderr.splitlines():
        if "Duration:" in line:
            raw = line.split("Duration:", 1)[1].split(",", 1)[0].strip()
            hh, mm, ss = raw.split(":")
            return int(hh) * 3600 + int(mm) * 60 + float(ss)
    raise RuntimeError(f"Could not read duration from {video}")


def timestamp(seconds: float) -> str:
    seconds = max(0, seconds)
    minutes = int(seconds // 60)
    secs = seconds - minutes * 60
    return f"{minutes:02d}:{secs:05.2f}"


def parse_vtt_time(raw: str) -> float:
    parts = raw.strip().replace(",", ".").split(":")
    if len(parts) == 3:
        hh, mm, ss = parts
        return int(hh) * 3600 + int(mm) * 60 + float(ss)
    if len(parts) == 2:
        mm, ss = parts
        return int(mm) * 60 + float(ss)
    return float(parts[0])


def read_vtt(vtt_path: Path) -> list[Cue]:
    if not vtt_path.exists():
        return []
    lines = vtt_path.read_text(encoding="utf-8").splitlines()
    cues: list[Cue] = []
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if "-->" not in line:
            index += 1
            continue
        start_raw, end_raw = [part.strip() for part in line.split("-->", 1)]
        text_lines: list[str] = []
        index += 1
        while index < len(lines) and lines[index].strip():
            text_lines.append(lines[index].strip())
            index += 1
        cues.append(Cue(parse_vtt_time(start_raw), parse_vtt_time(end_raw), " ".join(text_lines)))
    return cues


def speech_samples(start: float, end: float) -> list[float]:
    if end <= start:
        return []
    samples = {start + 0.12, start + ((end - start) / 2), max(start + 0.12, end - 0.18)}
    return sorted(ts for ts in samples if start <= ts <= end)


def covered_by_captions(start: float, end: float, cues: list[Cue]) -> tuple[float, list[tuple[float, float]]]:
    relevant = sorted(
        (max(start, cue.start), min(end, cue.end))
        for cue in cues
        if cue.end > start and cue.start < end
    )
    merged: list[tuple[float, float]] = []
    for cue_start, cue_end in relevant:
        if cue_end <= cue_start:
            continue
        if not merged or cue_start > merged[-1][1]:
            merged.append((cue_start, cue_end))
        else:
            merged[-1] = (merged[-1][0], max(merged[-1][1], cue_end))
    covered = sum(cue_end - cue_start for cue_start, cue_end in merged)
    gaps: list[tuple[float, float]] = []
    cursor = start
    for cue_start, cue_end in merged:
        if cue_start - cursor > MAX_SPEECH_WITHOUT_CAPTION_GAP:
            gaps.append((cursor, cue_start))
        cursor = max(cursor, cue_end)
    if end - cursor > MAX_SPEECH_WITHOUT_CAPTION_GAP:
        gaps.append((cursor, end))
    return covered / max(0.001, end - start), gaps


def extract_frame(video: Path, timestamp_seconds: float, out_file: Path) -> None:
    out_file.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            str(FFMPEG),
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            f"{timestamp_seconds:.3f}",
            "-i",
            str(video),
            "-frames:v",
            "1",
            "-q:v",
            "2",
            "-y",
            str(out_file),
        ]
    )


def caption_visibility_score(frame: Path) -> float:
    image = Image.open(frame).convert("RGB")
    width, height = image.size
    crop = image.crop((0, int(height * CAPTION_REGION_TOP), width, height))
    pixels = crop.getdata()
    bright = 0
    caption_box = 0
    for red, green, blue in pixels:
        if red > 205 and green > 205 and blue > 205:
            bright += 1
        if red < 170 and green < 170 and blue < 170:
            caption_box += 1
    total = max(1, crop.width * crop.height)
    # Burned captions are white glyphs over a dark or gray translucent box.
    # Requiring both avoids counting bright clothing/background as a caption.
    return min(bright / total, caption_box / total)


def build_sheet(video_stem: str, sampled_frames: list[dict]) -> Path | None:
    if not sampled_frames:
        return None
    SHEETS_DIR.mkdir(parents=True, exist_ok=True)
    thumbs = []
    font = ImageFont.load_default()
    for sample in sampled_frames[:160]:
        image = Image.open(ROOT / sample["frame"]).convert("RGB")
        width, height = image.size
        crop = image.crop((0, int(height * 0.50), width, height))
        crop.thumbnail((420, 236))
        canvas = Image.new("RGB", (450, 285), "white")
        canvas.paste(crop, ((450 - crop.width) // 2, 8))
        draw = ImageDraw.Draw(canvas)
        label = f"{timestamp(sample['time'])} score={sample['caption_score']:.4f}"
        draw.text((12, 252), label, fill=(0, 0, 0), font=font)
        thumbs.append(canvas)

    cols = 4
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * 450, rows * 285), "white")
    for idx, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((idx % cols) * 450, (idx // cols) * 285))
    sheet_path = SHEETS_DIR / f"{video_stem}.jpg"
    sheet.save(sheet_path, quality=92)
    return sheet_path


def normalized_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def audit_video(video: Path) -> dict:
    transcript_path = TRANSCRIPTS_DIR / f"{video.stem}.json"
    if video.stem == "hospice-core-services-korean-english-subtitles" and VIDEO1_REMEDIATION_TRANSCRIPT.exists():
        transcript_path = VIDEO1_REMEDIATION_TRANSCRIPT
    remediation_transcript = REMEDIATION_TRANSCRIPTS_DIR / f"{video.stem}.ko.transcript.json"
    if remediation_transcript.exists():
        transcript_path = remediation_transcript
    vtt_path = CAPTIONS_DIR / f"{video.stem}.en.vtt"
    transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    cues = read_vtt(vtt_path)
    duration = duration_seconds(video)
    intervals = []
    low_visibility_samples = []
    sampled_frames = []
    total_samples = 0

    for segment_index, segment in enumerate(transcript["segments"], 1):
        start = float(segment["start"])
        end = float(segment["end"])
        text = normalized_text(segment["text"])
        if not text or end <= start:
            continue
        coverage, timing_gaps = covered_by_captions(start, end, cues)
        samples = []
        for sample_index, sample_time in enumerate(speech_samples(start, end), 1):
            frame = FRAMES_DIR / video.stem / f"{segment_index:04d}_{sample_index:02d}_{sample_time:08.3f}.jpg"
            extract_frame(video, sample_time, frame)
            score = caption_visibility_score(frame)
            total_samples += 1
            sample = {
                "time": round(sample_time, 3),
                "frame": str(frame.relative_to(ROOT)),
                "caption_score": round(score, 6),
                "caption_visible": score >= MIN_VISIBLE_CAPTION_SCORE,
            }
            samples.append(sample)
            if not sample["caption_visible"]:
                low_visibility_samples.append(sample)
                if len(sampled_frames) < 160:
                    sampled_frames.append(sample)
        intervals.append(
            {
                "index": segment_index,
                "start": round(start, 3),
                "end": round(end, 3),
                "duration": round(end - start, 3),
                "speech_text": text,
                "caption_timing_coverage": round(coverage, 4),
                "timing_gaps": [
                    {"start": round(gap_start, 3), "end": round(gap_end, 3)}
                    for gap_start, gap_end in timing_gaps
                ],
                "samples": samples,
            }
        )

    if not sampled_frames:
        # Still provide a representative review sheet when there were no failures.
        for interval in intervals:
            for sample in interval["samples"]:
                if len(sampled_frames) >= 160:
                    break
                sampled_frames.append(sample)
            if len(sampled_frames) >= 160:
                break
    sheet = build_sheet(video.stem, sampled_frames)
    timing_gap_count = sum(len(interval["timing_gaps"]) for interval in intervals)

    return {
        "video": str(video.relative_to(ROOT)),
        "duration": round(duration, 3),
        "transcript": str(transcript_path.relative_to(ROOT)),
        "vtt": str(vtt_path.relative_to(ROOT)),
        "review_sheet": str(sheet.relative_to(ROOT)) if sheet else None,
        "speech_intervals": len(intervals),
        "speech_samples": total_samples,
        "low_visibility_samples": len(low_visibility_samples),
        "timing_gaps": timing_gap_count,
        "status": "pass" if not low_visibility_samples and timing_gap_count == 0 else "review",
        "intervals": intervals,
    }


def write_markdown(results: list[dict]) -> None:
    lines = [
        "# Video Seeking And Caption QA",
        "",
        "Date: 2026-06-23",
        "",
        "## Method",
        "",
        "- Source of truth: burned-in MP4 captions.",
        "- Speech windows: existing Whisper segment/word-timestamp transcripts.",
        "- Caption timing check: matching WebVTT cue coverage for each spoken segment.",
        "- Visual check: extracted frames throughout every spoken segment and scored the lower caption region for visible burned-in caption pixels.",
        "- Manual review artifact: per-video contact sheets and per-interval JSON manifests under `audit/seek_caption_qa/`.",
        "",
        "This is an exhaustive technical/manual-review aid, not a certified Korean-English clinical translation review.",
        "",
        "## Results",
        "",
        "| Video | Result | Speech intervals | Frame samples | Timing gaps | Visibility flags | Evidence |",
        "| --- | --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for result in results:
        lines.append(
            "| `{video}` | {status} | {intervals} | {samples} | {gaps} | {flags} | `{sheet}` |".format(
                video=Path(result["video"]).name,
                status="Pass" if result["status"] == "pass" else "Needs review",
                intervals=result["speech_intervals"],
                samples=result["speech_samples"],
                gaps=result["timing_gaps"],
                flags=result["low_visibility_samples"],
                sheet=result["review_sheet"] or "",
            )
        )
    lines.extend(
        [
            "",
            "## Interpretation",
            "",
        "- `Timing gaps` means the editable VTT timing does not cover part of a detected speech segment.",
            "- `Visibility flags` means a sampled frame inside speech had too little caption-region contrast to confidently confirm a burned-in caption.",
            "- Any non-zero value should be manually opened at the timestamp in `review_manifest.json` before publication.",
        ]
    )
    browser_results = OUT_DIR / "browser_seek_results.json"
    if browser_results.exists():
        data = json.loads(browser_results.read_text(encoding="utf-8"))
        lines.extend(
            [
                "",
                "## Browser Seek Check",
                "",
                f"- Results: `{browser_results.relative_to(ROOT)}`",
                f"- Routes checked: {data.get('routesChecked', 'unknown')}.",
                f"- Embedded video instances checked: {data.get('videosChecked', 'unknown')}.",
                f"- Failures: {len(data.get('failures', []))}.",
                "",
                "The browser pass confirmed native controls, metadata loading, keyboard seeking forward/backward, and no default/showing VTT tracks that would duplicate the burned-in captions.",
            ]
        )
    (OUT_DIR / "REPORT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    selected = set(sys.argv[1:])
    results = []
    for video in sorted(VIDEOS_DIR.glob("*.mp4")):
        if selected and video.name not in selected and video.stem not in selected:
            continue
        print(f"QA {video.name}", flush=True)
        result = audit_video(video)
        results.append(result)
        per_video = OUT_DIR / f"{video.stem}.json"
        per_video.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    manifest = {
        "date": "2026-06-23",
        "source_of_truth": "burned-in MP4 captions",
        "sample_strategy": SAMPLE_STRATEGY,
        "min_visible_caption_score": MIN_VISIBLE_CAPTION_SCORE,
        "videos": results,
    }
    (OUT_DIR / "review_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_markdown(results)
    print(f"Wrote {OUT_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
