from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
from pathlib import Path

import imageio_ffmpeg


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path(r"C:\Users\emine\Downloads")
VIDEOS_DIR = ROOT / "public" / "videos"
TRANSCRIPTS = ROOT / "audit" / "video_captions" / "transcripts"
CAPTION_MASTER = ROOT / "audit" / "caption_master"
VTT_DIR = ROOT / "public" / "captions"
WORK_DIR = ROOT / "audit" / "caption_render"
ASS_DIR = WORK_DIR / "ass"
BACKUP_DIR = WORK_DIR / "previous_burned_caption_videos"
OUTPUT_DIR = WORK_DIR / "rendered_master"
FFMPEG = Path(imageio_ffmpeg.get_ffmpeg_exe())


VIDEO_MAP = {
    "videoplayback (1).mp4": "hospice-core-services-korean-english-subtitles.mp4",
    "videoplayback (2).mp4": "hospice-myths-korean-english-subtitles.mp4",
    "videoplayback (3).mp4": "after-death-hospice-korean-english-subtitles.mp4",
    "videoplayback (4).mp4": "after-death-non-hospice-polst-korean-english-subtitles.mp4",
    "videoplayback (5).mp4": "end-of-life-timing-korean-english-subtitles.mp4",
    "videoplayback (6).mp4": "hospice-team-interview-younghee-kim-korean-english-subtitles.mp4",
    "videoplayback (7).mp4": "hospice-nurse-interview-janice-korean-english-subtitles.mp4",
    "videoplayback (8).mp4": "hospice-social-work-bereavement-interview-peter-park-korean-english-subtitles.mp4",
    "videoplayback.mp4": "polst-korean-english-subtitles.mp4",
}


REPLACEMENTS = [
    ("Kim Jung-ah", "Kim Jeong Ah"),
    ("County Corona", "County Coroner"),
    ("county corona", "county coroner"),
    ("prosecutor's office", "coroner's office"),
    ("prosecutor's", "coroner's"),
    ("Peter Bang", "Peter Park"),
    ("pre-healing order", "advance health care directive"),
    ("pre-treatment", "resuscitation"),
    ("pre-trial", "post-death"),
    ("DNA donor resuscitation", "DNR, do not resuscitate"),
    ("Yangro Hospital", "nursing facility"),
    ("Yangro Hotel", "nursing facility"),
    ("makeup", "cremation"),
    ("Part D is the last name.", "Part D is the final section."),
    ("Thank you for your hard work in 2014.", "Thank you for watching."),
    ("keep the vaccination", "continue the medication"),
    ("too many drugs", "too much medication"),
    ("patient's fault", "what happened to the patient"),
    ("will of life", "remaining life"),
    ("post.", "POLST."),
    ("The post", "POLST"),
    ("the post", "POLST"),
]


def clean_text(text: str) -> str:
    text = text.strip()
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = re.sub(r"\bpost\b", "POLST", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text)
    return text


def ass_time(seconds: float) -> str:
    centiseconds = int(round(seconds * 100))
    hours, rem = divmod(centiseconds, 360_000)
    minutes, rem = divmod(rem, 6_000)
    secs, cs = divmod(rem, 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{cs:02d}"


def escape_ass(text: str) -> str:
    return text.replace("\\", "\\\\").replace("{", r"\{").replace("}", r"\}")


def line_chunks(text: str, width: int = 42) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    current_len = 0
    for word in words:
        next_len = current_len + len(word) + (1 if current else 0)
        if current and next_len > width:
            lines.append(" ".join(current))
            current = [word]
            current_len = len(word)
        else:
            current.append(word)
            current_len = next_len
    if current:
        lines.append(" ".join(current))
    return ["\\N".join(lines[i : i + 2]) for i in range(0, len(lines), 2)]


def two_line_ass(text: str, width: int = 42) -> str:
    lines = wrap_lines(text, width=width, max_lines=2)
    return "\\N".join(lines)


def two_line_vtt(text: str, width: int = 52) -> str:
    return "\n".join(wrap_lines(text, width=width, max_lines=2))


def wrap_lines(text: str, width: int, max_lines: int) -> list[str]:
    tokens = text.split()
    if not tokens:
        return []
    lines: list[str] = []
    current: list[str] = []
    current_len = 0
    for token in tokens:
        next_len = current_len + len(token) + (1 if current else 0)
        if current and next_len > width and len(lines) < max_lines - 1:
            lines.append(" ".join(current))
            current = [token]
            current_len = len(token)
        else:
            current.append(token)
            current_len = next_len
    if current:
        lines.append(" ".join(current))
    return lines[:max_lines]


def vtt_time(seconds: float) -> str:
    millis = int(round(seconds * 1000))
    hours, rem = divmod(millis, 3_600_000)
    minutes, rem = divmod(rem, 60_000)
    secs, ms = divmod(rem, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{ms:03d}"


def read_master(target_name: str) -> list[dict]:
    master = CAPTION_MASTER / f"{Path(target_name).stem}.json"
    if not master.exists():
        raise FileNotFoundError(f"Missing caption master: {master}")
    data = json.loads(master.read_text(encoding="utf-8"))
    return [
        {
            "start": float(entry["start"]),
            "end": float(entry["end"]),
            "text": clean_text(entry["text"]),
        }
        for entry in data["entries"]
        if clean_text(entry["text"])
    ]


def build_ass(target_name: str) -> Path:
    entries = read_master(target_name)
    ASS_DIR.mkdir(parents=True, exist_ok=True)
    ass_path = ASS_DIR / f"{Path(target_name).stem}.ass"
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 640
PlayResY: 360
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,18,&H00FFFFFF,&H000000FF,&H80000000,&HCC000000,-1,0,0,0,100,100,0,0,3,2,0,2,42,42,64,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    for entry in entries:
        cue_text = two_line_ass(entry["text"], width=42)
        events.append(
            f"Dialogue: 0,{ass_time(entry['start'])},{ass_time(entry['end'])},Default,,0,0,0,,{escape_ass(cue_text)}"
        )
    ass_path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")
    return ass_path


def build_vtt(target_name: str) -> Path:
    entries = read_master(target_name)
    VTT_DIR.mkdir(parents=True, exist_ok=True)
    vtt_path = VTT_DIR / f"{Path(target_name).stem}.en.vtt"
    lines = ["WEBVTT", ""]
    for index, entry in enumerate(entries, 1):
        lines.append(str(index))
        lines.append(f"{vtt_time(entry['start'])} --> {vtt_time(entry['end'])}")
        lines.append(two_line_vtt(entry["text"], width=52))
        lines.append("")
    vtt_path.write_text("\n".join(lines), encoding="utf-8")
    return vtt_path


def ffmpeg_filter_path(path: Path) -> str:
    return str(path.resolve()).replace("\\", "/").replace(":", r"\:")


def render(source: Path, ass: Path, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    filter_arg = f"subtitles='{ffmpeg_filter_path(ass)}'"
    cmd = [
        str(FFMPEG),
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        str(source),
        "-vf",
        filter_arg,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "20",
        "-c:a",
        "copy",
        "-movflags",
        "+faststart",
        str(output),
    ]
    subprocess.run(cmd, check=True)


def main() -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_name, target_name in VIDEO_MAP.items():
        source = DOWNLOADS / source_name
        target = VIDEOS_DIR / target_name
        if not source.exists():
            raise FileNotFoundError(source)
        if target.exists():
            backup = BACKUP_DIR / target_name
            if not backup.exists():
                shutil.copy2(target, backup)
        build_vtt(target_name)
        ass = build_ass(target_name)
        rendered = OUTPUT_DIR / target_name
        print(f"Rendering {source.name} -> {target_name}", flush=True)
        render(source, ass, rendered)
        shutil.copy2(rendered, target)
    print("Done")


if __name__ == "__main__":
    main()
