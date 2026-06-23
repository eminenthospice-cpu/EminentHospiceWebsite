from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PY_PACKAGES = ROOT / "audit" / "local_python_packages"
if PY_PACKAGES.exists():
    sys.path.insert(0, str(PY_PACKAGES))

from faster_whisper import WhisperModel  # noqa: E402


DOWNLOADS = Path(r"C:\Users\emine\Downloads")
OUT_DIR = ROOT / "audit" / "video_caption_remediation"
MODEL_ROOT = (
    Path.home()
    / ".cache"
    / "huggingface"
    / "hub"
    / "models--Systran--faster-whisper-small"
    / "snapshots"
)

VIDEO_MAP = {
    "videoplayback (2).mp4": "hospice-myths-korean-english-subtitles",
    "videoplayback (3).mp4": "after-death-hospice-korean-english-subtitles",
    "videoplayback (4).mp4": "after-death-non-hospice-polst-korean-english-subtitles",
    "videoplayback (5).mp4": "end-of-life-timing-korean-english-subtitles",
    "videoplayback (6).mp4": "hospice-team-interview-younghee-kim-korean-english-subtitles",
    "videoplayback (7).mp4": "hospice-nurse-interview-janice-korean-english-subtitles",
    "videoplayback (8).mp4": "hospice-social-work-bereavement-interview-peter-park-korean-english-subtitles",
    "videoplayback.mp4": "polst-korean-english-subtitles",
}


def find_model() -> Path:
    snapshots = sorted(MODEL_ROOT.glob("*"))
    if not snapshots:
        raise FileNotFoundError(f"No cached faster-whisper-small snapshot found under {MODEL_ROOT}")
    return snapshots[-1]


def segment_to_dict(segment) -> dict:
    return {
        "id": segment.id,
        "start": round(float(segment.start), 3),
        "end": round(float(segment.end), 3),
        "text": segment.text.strip(),
        "words": [
            {
                "start": round(float(word.start), 3),
                "end": round(float(word.end), 3),
                "word": word.word,
                "probability": float(word.probability),
            }
            for word in (segment.words or [])
        ],
    }


def write_result(source_video: Path, model_path: Path, stem: str, suffix: str, info, segments: list[dict]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = {
        "source_video": str(source_video),
        "model": str(model_path),
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "segments": segments,
    }
    json_path = OUT_DIR / f"{stem}.{suffix}.json"
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    txt_lines = [
        f"[{segment['start']:08.3f} -> {segment['end']:08.3f}] {segment['text']}"
        for segment in segments
    ]
    json_path.with_suffix(".txt").write_text("\n".join(txt_lines) + "\n", encoding="utf-8")


def transcribe_one(model: WhisperModel, model_path: Path, source_video: Path, stem: str, task: str, suffix: str) -> None:
    if (OUT_DIR / f"{stem}.{suffix}.json").exists():
        print(f"{stem}: {task} already exists, skipping", flush=True)
        return
    print(f"{stem}: {task}", flush=True)
    segments_iter, info = model.transcribe(
        str(source_video),
        language="ko",
        task=task,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 350},
        beam_size=5,
        best_of=5,
        temperature=0,
        condition_on_previous_text=True,
    )
    segments = [segment_to_dict(segment) for segment in segments_iter]
    write_result(source_video, model_path, stem, suffix, info, segments)


def main() -> None:
    selected = set(sys.argv[1:])
    model_path = find_model()
    model = WhisperModel(str(model_path), device="cpu", compute_type="int8")

    for source_name, stem in VIDEO_MAP.items():
        if selected and source_name not in selected and stem not in selected:
            continue
        source_video = DOWNLOADS / source_name
        if not source_video.exists():
            raise FileNotFoundError(source_video)
        transcribe_one(model, model_path, source_video, stem, "transcribe", "ko.transcript")
        transcribe_one(model, model_path, source_video, stem, "translate", "en.machine_translation")


if __name__ == "__main__":
    main()
