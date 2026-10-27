"""Lossless delivery conversion. No resize, sharpening, or generational recompression."""
from pathlib import Path
from PIL import Image, ImageChops
import json, hashlib, sys
source = Path(sys.argv[1])
target = Path(__file__).resolve().parents[1] / 'public/assets/v4'
target.mkdir(parents=True, exist_ok=True)
manifest = []
for path in sorted(source.glob('*.png')):
    with Image.open(path) as original:
        rgba = original.convert('RGBA')
        destination = target / (path.stem + '.webp')
        unchanged = destination.exists() and Image.open(destination).convert('RGBA').tobytes() == rgba.tobytes()
        if not unchanged:
            rgba.save(destination, 'WEBP', lossless=True, quality=100, method=6, exact=True)
        decoded = Image.open(destination).convert('RGBA')
        assert rgba.tobytes() == decoded.tobytes(), path.name
        manifest.append(dict(name=path.stem, width=rgba.width, height=rgba.height,
            pngBytes=path.stat().st_size, webpBytes=destination.stat().st_size,
            decodedPixelsIdentical=True, sha256=hashlib.sha256(destination.read_bytes()).hexdigest()))
docs = target.parents[2] / 'docs'
docs.mkdir(exist_ok=True)
(docs / 'image-manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
print(json.dumps(dict(images=len(manifest),pngBytes=sum(x['pngBytes'] for x in manifest),webpBytes=sum(x['webpBytes'] for x in manifest))))
