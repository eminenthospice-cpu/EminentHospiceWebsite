# Video Seeking And Caption QA

Date: 2026-06-23

## Method

- Source of truth: burned-in MP4 captions.
- Speech windows: existing Whisper segment/word-timestamp transcripts.
- Caption timing check: matching WebVTT cue coverage for each spoken segment.
- Visual check: extracted frames throughout every spoken segment and scored the lower caption region for visible burned-in caption pixels.
- Manual review artifact: per-video contact sheets and per-interval JSON manifests under `audit/seek_caption_qa/`.

This is an exhaustive technical/manual-review aid, not a certified Korean-English clinical translation review.

## Results

| Video | Result | Speech intervals | Frame samples | Timing gaps | Visibility flags | Evidence |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `after-death-hospice-korean-english-subtitles.mp4` | Pass | 85 | 255 | 0 | 0 | `audit\seek_caption_qa\sheets\after-death-hospice-korean-english-subtitles.jpg` |
| `after-death-non-hospice-polst-korean-english-subtitles.mp4` | Pass | 81 | 243 | 0 | 0 | `audit\seek_caption_qa\sheets\after-death-non-hospice-polst-korean-english-subtitles.jpg` |
| `end-of-life-timing-korean-english-subtitles.mp4` | Pass | 169 | 506 | 0 | 0 | `audit\seek_caption_qa\sheets\end-of-life-timing-korean-english-subtitles.jpg` |
| `hospice-core-services-korean-english-subtitles.mp4` | Pass | 233 | 699 | 0 | 0 | `audit\seek_caption_qa\sheets\hospice-core-services-korean-english-subtitles.jpg` |
| `hospice-myths-korean-english-subtitles.mp4` | Pass | 175 | 523 | 0 | 0 | `audit\seek_caption_qa\sheets\hospice-myths-korean-english-subtitles.jpg` |
| `hospice-nurse-interview-janice-korean-english-subtitles.mp4` | Pass | 45 | 135 | 0 | 0 | `audit\seek_caption_qa\sheets\hospice-nurse-interview-janice-korean-english-subtitles.jpg` |
| `hospice-social-work-bereavement-interview-peter-park-korean-english-subtitles.mp4` | Pass | 80 | 238 | 0 | 0 | `audit\seek_caption_qa\sheets\hospice-social-work-bereavement-interview-peter-park-korean-english-subtitles.jpg` |
| `hospice-team-interview-younghee-kim-korean-english-subtitles.mp4` | Pass | 38 | 114 | 0 | 0 | `audit\seek_caption_qa\sheets\hospice-team-interview-younghee-kim-korean-english-subtitles.jpg` |
| `polst-korean-english-subtitles.mp4` | Pass | 156 | 468 | 0 | 0 | `audit\seek_caption_qa\sheets\polst-korean-english-subtitles.jpg` |

## Interpretation

- `Timing gaps` means the editable VTT timing does not cover part of a detected speech segment.
- `Visibility flags` means a sampled frame inside speech had too little caption-region contrast to confidently confirm a burned-in caption.
- Any non-zero value should be manually opened at the timestamp in `review_manifest.json` before publication.

## Browser Seek Check

- Results: `audit\seek_caption_qa\browser_seek_results.json`
- Routes checked: 10.
- Embedded video instances checked: 18.
- Failures: 0.

The browser pass confirmed native controls, metadata loading, keyboard seeking forward/backward, and no default/showing VTT tracks that would duplicate the burned-in captions.
