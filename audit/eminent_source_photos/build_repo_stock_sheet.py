from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
PHOTO_DIR = ROOT / "audit" / "eminent_source_photos" / "repo_stock"
OUT = ROOT / "audit" / "eminent_source_photos" / "repo-stock-sheet.png"

files = sorted(p for p in PHOTO_DIR.iterdir() if p.suffix.lower() == ".webp")

tile_w, tile_h = 240, 210
rows = (len(files) + 2) // 3
sheet = Image.new("RGB", (tile_w * 3, tile_h * rows), "#e8e5dc")
draw = ImageDraw.Draw(sheet)

for index, path in enumerate(files):
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
    draw.text((x + 8, y + 180), path.name, fill="#111")
    draw.text((x + 8, y + 196), f"{original_w} x {original_h}", fill="#555")

sheet.save(OUT)
print(OUT)
