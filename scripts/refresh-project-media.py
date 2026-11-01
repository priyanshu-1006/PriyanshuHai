"""Refresh reviewed project captures without modifying the supplied originals."""
from pathlib import Path
from PIL import Image
import argparse

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--projects', type=Path, default=Path('C:/Users/priya/OneDrive/Desktop/CODING/Projects'))
args = parser.parse_args()
def save(source, slug, name):
    destination = root / 'public/projects' / slug / (name + '.webp')
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert('RGB')
        image.thumbnail((1920, 1600))
        image.save(destination, 'WEBP', quality=90, method=6)
    print(destination.relative_to(root))

for name in ['workspace-home', 'notebook-review', 'document-review']:
    save(args.projects / 'Little_Code/website/public/assets' / (name + '.png'), 'little-code', name)
for name in ['project-memory', 'mcp-connection']:
    save(args.projects / 'Little_Code/website/public/assets/docs' / (name + '.png'), 'little-code', name)
for source, name in [
    ('01-product-overview.jpg', 'product-overview'),
    ('02-native-tools-and-theme.png', 'native-tools-and-theme'),
    ('03-launch-profile.png', 'launch-profile'),
    ('04-workspace-services-ready.png', 'workspace-services-ready'),
    ('05-ssh-connection-review.png', 'ssh-connection-review'),
    ('06-ai-request-review.png', 'ai-request-review'),
    ('07-local-tool-result-not-sent.png', 'local-tool-result-not-sent'),
    ('08-history-and-private-pane.png', 'history-and-private-pane'),
]: save(root / 'public/projects/little-terminal' / source, 'little-terminal', name)
save(root / 'public/projects/ManakMitra Hero.png', 'manakmitra', 'hero')
save(root / 'public/projects/ManakMitra Partner API.png', 'manakmitra', 'partner-api')
save(root / 'public/projects/SatyaDwar Hero.png', 'satyadwar', 'hero')
