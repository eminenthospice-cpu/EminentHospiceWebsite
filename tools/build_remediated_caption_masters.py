from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
IN_DIR = ROOT / "audit" / "video_caption_remediation"
OUT_DIR = ROOT / "audit" / "caption_master"

MAX_WORDS = 14
MIN_WORDS = 6
MAX_DURATION = 6.0
MAX_GAP = 0.85

TARGET_STEMS = {
    "hospice-myths-korean-english-subtitles",
    "after-death-hospice-korean-english-subtitles",
    "after-death-non-hospice-polst-korean-english-subtitles",
    "end-of-life-timing-korean-english-subtitles",
    "hospice-team-interview-younghee-kim-korean-english-subtitles",
    "hospice-nurse-interview-janice-korean-english-subtitles",
    "hospice-social-work-bereavement-interview-peter-park-korean-english-subtitles",
    "polst-korean-english-subtitles",
}

REPLACEMENTS = [
    ("Kim Jung-ah", "Kim Jeong Ah"),
    ("Kim Young-hee", "Kim Young Hee"),
    ("PORST", "POLST"),
    ("PORS T", "POLST"),
    ("PALT", "Part"),
    ("pink dream", "pink form"),
    ("bright pink container", "bright pink form"),
    ("lung surgery", "intubation"),
    ("medical resource", "medical order"),
    ("pre-ordinary decision", "advance decision"),
    ("full-code", "full code"),
    ("all side-by-side treatment", "all life-sustaining treatment"),
    ("does it go back quickly", "does the patient die sooner"),
    ("does it go back soon", "does the patient die sooner"),
    ("patients don't go back quickly", "patients do not die sooner"),
    ("patients don't go back soon", "patients do not die sooner"),
    ("Are you going to use a rag when you do hospice?", "Does hospice mean the patient will die sooner?"),
    ("wet tissue", "die sooner"),
    ("break the medicine", "stop the medication"),
    ("break the medicines", "stop the medications"),
    ("clean it up", "review and simplify it"),
    ("drugs", "medications"),
    ("drug", "medication"),
    ("vaccination", "condition"),
    ("approval process", "condition"),
    ("County Corona", "County Coroner"),
    ("county corona", "county coroner"),
    ("prosecutor's office", "coroner's office"),
    ("prosecutor's", "coroner's"),
    ("Peter Bang", "Peter Park"),
    ("Yangro Hospital", "nursing facility"),
    ("Yangro Hotel", "nursing facility"),
    ("makeup", "cremation"),
    ("Part D is the last name.", "Part D is the final section."),
    ("Thank you for your hard work in 2014.", "Thank you for watching."),
]


def clean_text(text: str) -> str:
    text = text.strip()
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = re.sub(r"\bpost\b", "POLST", text, flags=re.IGNORECASE)
    text = re.sub(r"\bporst\b", "POLST", text, flags=re.IGNORECASE)
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
        end = entry["end"] if index == len(chunks) - 1 else cursor + duration * (len(chunk) / total_words)
        output.append(
            {
                "start": round(cursor, 3),
                "end": round(end, 3),
                "text": clean_text(" ".join(chunk)),
                "review_status": "fresh_asr_machine_translation_cleaned",
                "notes": "Built from fresh local Korean ASR translate pass with deterministic terminology cleanup; human Korean-English review still recommended.",
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
    stem = transcript_file.name.removesuffix(".en.machine_translation.json")
    transcript = json.loads(transcript_file.read_text(encoding="utf-8"))
    korean_transcript_file = IN_DIR / f"{stem}.ko.transcript.json"
    korean_transcript = json.loads(korean_transcript_file.read_text(encoding="utf-8"))
    english_segments = transcript["segments"]
    korean_segments = korean_transcript["segments"]
    raw_segments = [
        {
            "start": float(korean_segment["start"]),
            "end": float(korean_segment["end"]),
            "text": clean_text(
                english_segments[index]["text"]
                if index < len(english_segments)
                else korean_segment["text"]
            ),
        }
        for index, korean_segment in enumerate(korean_segments)
        if clean_text(
            english_segments[index]["text"]
            if index < len(english_segments)
            else korean_segment["text"]
        )
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
                "review_status": "fresh_asr_machine_translation_cleaned",
                "notes": "Built from fresh local Korean ASR translate pass with deterministic terminology cleanup; human Korean-English review still recommended.",
            }
            entries.extend(split_long_entry(entry))
            group = []

    return {
        "video": f"public/videos/{stem}.mp4",
        "source_transcript": str(transcript_file.relative_to(ROOT)),
        "korean_transcript": str((IN_DIR / f"{stem}.ko.transcript.json").relative_to(ROOT)),
        "language": "en",
        "source": "fresh local Korean ASR translate pass grouped into phrase-level captions",
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
    for transcript_file in sorted(IN_DIR.glob("*.en.machine_translation.json")):
        stem = transcript_file.name.removesuffix(".en.machine_translation.json")
        if stem not in TARGET_STEMS:
            continue
        master = build_master(transcript_file)
        out_file = OUT_DIR / f"{stem}.json"
        out_file.write_text(json.dumps(master, ensure_ascii=False, indent=2), encoding="utf-8")
        print(out_file.relative_to(ROOT))


if __name__ == "__main__":
    main()
