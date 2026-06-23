from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
PHOTO_DIR = ROOT / "public" / "images" / "photos"
OUT = ROOT / "audit" / "eminent_source_photos" / "final-site-photo-sheet.png"

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

tile_w, tile_h = 240, 210
sheet = Image.new("RGB", (tile_w * 3, tile_h * 4), "#e8e5dc")
draw = ImageDraw.Draw(sheet)

for index, filename in enumerate(files):
    path = PHOTO_DIR / filename
    image = Image.open(path).convert("RGB")
    original_w, original_h = image.size
    preview = image.copy()
    preview.thumbnail((tile_w, 160))
    tile = Image.new("RGB", (tile_w, 160), "#f3f3f0")
    tile.paste(preview, ((tile_w - preview.width) // 2, (160 - preview.height) // 2))

    x = (index % 3) * tile_w
    y = (index // 3) * tile_h
    sheet.paste(tile, (x, y))
    draw.rectangle([x, y + 166, x + tile_w, y + tile_h], fill="white")
    draw.text((x + 8, y + 180), filename, fill="#111")
    draw.text((x + 8, y + 196), f"{original_w} x {original_h}", fill="#555")

sheet.save(OUT)
print(OUT)
