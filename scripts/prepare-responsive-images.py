"""Create lossless WebP files sized for display, preserving full-size masters.

The resized pixels are encoded losslessly; resizing itself reduces resolution.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import hashlib, json

root = Path(__file__).resolve().parents[1]
source = root / 'public/assets/v4'
target = root / 'public/assets/responsive-v1'
target.mkdir(parents=True, exist_ok=True)

def generate(path):
    with Image.open(path) as image:
        image.load()
        width, height = image.size
        variants = []
        wide = path.stem.startswith('hero-') or path.stem in ('stadium', 'gift-strip', 'home-gift-strip', 'tactics-strip')
        for requested in ((480, 960, 1440) if wide else (480, 960)):
            if requested >= width:
                continue
            sized = image.resize((requested, round(height * requested / width)), Image.Resampling.LANCZOS)
            destination = target / f'{path.stem}-{requested}.webp'
            if not destination.exists() or Image.open(destination).convert('RGBA').tobytes() != sized.convert('RGBA').tobytes():
                sized.save(destination, 'WEBP', lossless=True, quality=100, method=6, exact=True)
            with Image.open(destination) as decoded:
                if decoded.convert('RGBA').tobytes() != sized.convert('RGBA').tobytes():
                    raise ValueError(f'Lossless verification failed: {destination}')
            variants.append({'width': requested, 'bytes': destination.stat().st_size,
                             'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()})
        return path.stem, {'width': width, 'height': height, 'originalBytes': path.stat().st_size, 'variants': variants}

with ThreadPoolExecutor(max_workers=3) as pool:
    data = dict(sorted(pool.map(generate, sorted(source.glob('*.webp')))))
logo = root / 'public/assets/logo.png'
with Image.open(logo) as image:
    sized = image.convert('RGBA').resize((480, 384), Image.Resampling.LANCZOS)
    out = target / 'logo-480.webp'
    sized.save(out, 'WEBP', lossless=True, quality=100, method=6, exact=True)
    with Image.open(out) as decoded:
        assert decoded.convert('RGBA').tobytes() == sized.tobytes()
    print('Logo bytes:', logo.stat().st_size, '->', out.stat().st_size)

manifest = root / 'docs/responsive-image-manifest.json'
manifest.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
js_data = {name: {'width': entry['width'], 'height': entry['height'],
                  'variants': [v['width'] for v in entry['variants']]} for name, entry in data.items()}
(root / 'src/image-data.mjs').write_text('export const imageData = ' + json.dumps(js_data, separators=(',', ':')) + ';\n', encoding='utf-8')
print('Images:', len(data), 'variants:', sum(len(x['variants']) for x in data.values()),
      'variant bytes:', sum(v['bytes'] for x in data.values() for v in x['variants']))
