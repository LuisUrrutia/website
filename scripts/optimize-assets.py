# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.64.0", "brotli==1.2.0", "opencv-python-headless==5.0.0.93"]
# ///
"""Regenerate the shipped font subset and brush: uv run scripts/optimize-assets.py."""

from pathlib import Path
import subprocess
import tempfile

import cv2
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT_SOURCE = ROOT / "src/assets/fonts/InterVariable.woff2"
FONT_TARGET = ROOT / "src/assets/fonts/InterVariable-latin.woff2"
BRUSH_SOURCE = ROOT / "src/assets/images/brush-original.svg"
BRUSH_TARGET = ROOT / "public/images/brush-1.svg"


def rasterize(source: Path, target: Path) -> None:
    subprocess.run([
        "bun", "-e",
        "import sharp from 'sharp'; await sharp(process.argv[1]).png().toFile(process.argv[2]);",
        str(source), str(target),
    ], check=True, cwd=ROOT)


# Latin-1 covers both locales; include every extra character used by the site.
codepoints = set(range(0x20, 0x100))
for source in (ROOT / "src").rglob("*"):
    if source.suffix in {".astro", ".mdx", ".ts"}:
        codepoints.update(map(ord, source.read_text()))
font = TTFont(FONT_SOURCE, recalcTimestamp=False)
original_cmap = font.getBestCmap()
options = subset.Options()
options.flavor = "woff2"
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=codepoints)
subsetter.subset(font)
font.save(FONT_TARGET)
assert codepoints.intersection(original_cmap) <= font.getBestCmap().keys()
assert "fvar" in font
print(f"Font: {FONT_SOURCE.stat().st_size} -> {FONT_TARGET.stat().st_size} bytes")

# Trace the existing alpha silhouette; discard specks below one rendered pixel.
with tempfile.TemporaryDirectory() as directory:
    raster = Path(directory) / "brush.png"
    rasterize(BRUSH_SOURCE, raster)
    alpha = cv2.imread(str(raster), cv2.IMREAD_UNCHANGED)[:, :, 3]
    _, mask = cv2.threshold(alpha, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    paths = []
    for contour in contours:
        if cv2.contourArea(contour) < 6:
            continue
        points = cv2.approxPolyDP(contour, 0.7, True).reshape(-1, 2)
        paths.append("M" + "L".join(f"{x} {y}" for x, y in points) + "Z")
    height, width = alpha.shape
    BRUSH_TARGET.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'preserveAspectRatio="none"><path fill="currentColor" fill-rule="evenodd" '
        f'd="{"".join(paths)}"/></svg>\n'
    )
    rasterize(BRUSH_TARGET, raster)
    result = cv2.imread(str(raster), cv2.IMREAD_UNCHANGED)[:, :, 3] > 127
    original = mask > 0
    overlap = (original & result).sum() / (original | result).sum()
    assert overlap > 0.95, f"Brush silhouette changed too much: {overlap:.1%} overlap"
    print(f"Brush silhouette overlap: {overlap:.1%}")
print(f"Brush: {BRUSH_SOURCE.stat().st_size} -> {BRUSH_TARGET.stat().st_size} bytes")
