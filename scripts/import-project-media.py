"""Curated portfolio screenshots, copied from the supplied local project sources."""
from pathlib import Path
from PIL import Image
import zipfile
import io

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = Path('C:/Users/priya/OneDrive/Desktop/CODING/Projects')

def save(slug, name, source):
    dest = ROOT / 'public' / 'projects' / slug / (name + '.webp')
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(source).convert('RGB')
    im.thumbnail((1600, 1400))
    im.save(dest, 'WEBP', quality=87, method=6)
    print(dest.relative_to(ROOT))

for name in ['workspace-home', 'notebook-review', 'document-review']:
    save('little-code', name, PROJECTS / 'Little_Code/website/public/assets' / (name + '.png'))
for name in ['project-memory', 'mcp-connection']:
    save('little-code', name, PROJECTS / 'Little_Code/website/public/assets/docs' / (name + '.png'))
for name in ['hub', 'tabs', 'workspace-dashboard', 'services-ready', 'ai-compose-review', 'git-changes']:
    save('little-terminal', name, PROJECTS / 'Little_Terminal/showcase/public/screenshots' / (name + '.png'))
for name in ['after2-officers-dashboard-1280', 'screening-capture', 'screening-analysis', 'after2-investigators-audit-trail-1280', 'after2-admin-model-registry-1280']:
    save('satyadwar', name, Path('P:/SIH/SatyaDwar/apps/showcase-web/public/product') / (name + '.png'))
with zipfile.ZipFile('P:/SIH/ManakMitra/docs/Evidence-Hub/02_ManakMitra_Product_Overview.docx') as z:
    for name, source in [('standards', 'e635f1f12574d64437417c1e16cdedcbe2d96eb7.png'), ('certification', 'c34a889c59bd854ebd1d941bf1d6f62e94eb6f6d.png'), ('laboratories', '47ab34e75225ead4918852863aa690c8865cc33b.png'), ('hallmarking', 'e6c529eb173995ebfad81353756cd94b0f379a52.png')]:
        save('manakmitra', name, io.BytesIO(z.read('word/media/' + source)))
