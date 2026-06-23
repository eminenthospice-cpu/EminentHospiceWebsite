from pathlib import Path
import subprocess


out = Path(__file__).parent / "repo_stock"
out.mkdir(parents=True, exist_ok=True)

files = [
    "homeHero.webp",
    "homePhilosophyPortrait.webp",
    "homeLevelRoutine.webp",
    "homeLevelContinuous.webp",
    "homeLevelInpatient.webp",
    "aboutHero.webp",
    "servicesHero.webp",
    "familiesHero.webp",
    "contactHero.webp",
    "griefHero.webp",
]

for file in files:
    data = subprocess.check_output(["git", "show", f"HEAD:public/images/photos/{file}"])
    (out / file).write_bytes(data)

print(f"wrote {len(files)} files to {out}")
