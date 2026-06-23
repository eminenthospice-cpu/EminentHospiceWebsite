from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPTS = ROOT / "audit" / "video_captions" / "transcripts"
OUT_DIR = ROOT / "audit" / "caption_master"

MAX_WORDS = 22
MIN_WORDS = 6
MAX_DURATION = 6.0
MAX_GAP = 0.85

REPLACEMENTS = [
    ("Kim Jung-ah", "Kim Jeong Ah"),
    ("Kim Jeong-hwa", "Kim Jeong Ah"),
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


def words(text: str) -> list[str]:
    return text.split()


def split_long_entry(entry: dict) -> list[dict]:
    tokens = words(entry["text"])
    if len(tokens) <= MAX_WORDS:
        return [entry]

    chunks: list[list[str]] = []
    current: list[str] = []
    for token in tokens:
        current.append(token)
        ends_sentence = token.endswith((".", "?", "!"))
        if len(current) >= MAX_WORDS or (len(current) >= MIN_WORDS and ends_sentence):
            chunks.append(current)
            current = []
    if current:
        if chunks and len(current) < 4:
            chunks[-1].extend(current)
        else:
            chunks.append(current)

    duration = max(0.4, entry["end"] - entry["start"])
    total_words = max(1, len(tokens))
    cursor = entry["start"]
    output = []
    for index, chunk in enumerate(chunks):
        if index == len(chunks) - 1:
            end = entry["end"]
        else:
            end = cursor + duration * (len(chunk) / total_words)
        output.append(
            {
                "start": round(cursor, 3),
                "end": round(end, 3),
                "text": " ".join(chunk),
                "review_status": "machine_draft",
                "notes": "Auto-generated from transcript; requires Korean-English review.",
            }
        )
        cursor = end
    return output


def should_flush(group: list[dict], next_segment: dict | None) -> bool:
    text = " ".join(segment["text"] for segment in group)
    token_count = len(words(text))
    duration = group[-1]["end"] - group[0]["start"]
    ends_sentence = text.endswith((".", "?", "!"))

    if next_segment is None:
        return True
    gap = next_segment["start"] - group[-1]["end"]
    if gap > MAX_GAP:
        return token_count >= MIN_WORDS or duration >= 1.1
    if token_count >= MAX_WORDS:
        return True
    if duration >= MAX_DURATION:
        return True
    if token_count >= MIN_WORDS and ends_sentence:
        return True
    return False


def build_master(transcript_file: Path) -> dict:
    transcript = json.loads(transcript_file.read_text(encoding="utf-8"))
    raw_segments = [
        {
            "start": float(segment["start"]),
            "end": float(segment["end"]),
            "text": clean_text(segment["text"]),
        }
        for segment in transcript["segments"]
        if clean_text(segment["text"])
    ]

    entries = []
    group: list[dict] = []
    for index, segment in enumerate(raw_segments):
        group.append(segment)
        next_segment = raw_segments[index + 1] if index + 1 < len(raw_segments) else None
        if should_flush(group, next_segment):
            text = clean_text(" ".join(item["text"] for item in group))
            entry = {
                "start": round(group[0]["start"], 3),
                "end": round(group[-1]["end"], 3),
                "text": text,
                "review_status": "machine_draft",
                "notes": "Auto-grouped to avoid one-word rolling fragments; requires Korean-English review.",
            }
            entries.extend(split_long_entry(entry))
            group = []

    return {
        "video": f"public/videos/{transcript_file.stem}.mp4",
        "source_transcript": str(transcript_file.relative_to(ROOT)),
        "language": "en",
        "source": "machine translation grouped into phrase-level draft captions",
        "review_required": True,
        "style": {
            "max_lines": 2,
            "line_width": 42,
            "burned_in": True,
            "vtt_accessibility_track": True,
        },
        "entries": entries,
    }


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = []
    for transcript_file in sorted(TRANSCRIPTS.glob("*.json")):
        master = build_master(transcript_file)
        out_file = OUT_DIR / f"{transcript_file.stem}.json"
        out_file.write_text(json.dumps(master, ensure_ascii=False, indent=2), encoding="utf-8")
        written.append(out_file)
    for path in written:
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
