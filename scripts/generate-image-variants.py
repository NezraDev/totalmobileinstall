"""Regenerate local responsive WebP assets with Pillow; originals stay unchanged.

Run manually after adding or replacing source photography:
    python scripts/generate-image-variants.py
Pillow is a maintainer tool only and is not needed to build or run the site.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
IMAGE_ROOT = PUBLIC / "images"
MANIFEST = ROOT / "src" / "content" / "image-variants.json"


def inspect_image(file):
    with Image.open(file) as image:
        return {
            "src": "/" + file.relative_to(PUBLIC).as_posix(),
            "width": image.width,
            "height": image.height,
        }


def create_variant(source, width):
    destination = source.with_name(f"{source.stem}-{width}.webp")
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        height = round(image.height * width / image.width)
        image = image.resize((width, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=86, method=6)
    return destination


def main():
    sources = []
    for folder in ("services", "gallery"):
        sources.extend(
            file
            for file in sorted((IMAGE_ROOT / folder).glob("*.webp"))
            if not file.stem.endswith(("-480", "-768"))
        )
    sources.append(IMAGE_ROOT / "brand" / "icon.png")
    sources.extend(sorted((IMAGE_ROOT / "badges").glob("badge-*.webp")))
    sources = [file for file in sources if not file.stem.endswith("-320")]

    manifest = {}
    for source in sources:
        original = inspect_image(source)
        variants = []
        if source.parent.name in ("services", "gallery"):
            if original["width"] > 480:
                variants.append(create_variant(source, 480))
            small = source.with_name(f"{source.stem}-768.webp")
            if small.exists():
                variants.append(small)
        elif source.stem == "icon":
            variants.extend(create_variant(source, width) for width in (160, 320))
        else:
            variants.append(create_variant(source, 320))

        candidates = [inspect_image(file) for file in variants] + [original]
        candidates.sort(key=lambda image: image["width"])
        manifest[original["src"]] = {
            "width": original["width"],
            "height": original["height"],
            "sources": candidates,
        }

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Generated responsive image metadata for {len(manifest)} originals.")


if __name__ == "__main__":
    main()
