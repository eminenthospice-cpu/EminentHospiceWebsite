from pathlib import Path

from PIL import Image, ImageDraw


directory = Path(__file__).parent
files = sorted(
    p
    for p in directory.iterdir()
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    and p.name != "contact-sheet.png"
)

tile_w, tile_h = 260, 220
sheet = Image.new("RGB", (tile_w * 3, tile_h * ((len(files) + 2) // 3)), "#e8e5dc")
draw = ImageDraw.Draw(sheet)

for index, file in enumerate(files):
    image = Image.open(file).convert("RGB")
    original_w, original_h = image.size
    thumb = image.copy()
    thumb.thumbnail((tile_w, 170))

    preview = Image.new("RGB", (tile_w, 170), "#f3f3f0")
    preview.paste(thumb, ((tile_w - thumb.width) // 2, (170 - thumb.height) // 2))

    x = (index % 3) * tile_w
    y = (index // 3) * tile_h
    sheet.paste(preview, (x, y))
    draw.rectangle([x, y + 176, x + tile_w, y + tile_h], fill="white")
    draw.text((x + 8, y + 190), file.stem.replace("source_", ""), fill="#111")
    draw.text((x + 8, y + 206), f"{original_w} x {original_h}", fill="#555")

out = directory / "contact-sheet.png"
sheet.save(out)
print(out)
