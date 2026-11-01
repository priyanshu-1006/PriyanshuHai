"""Render the supplied Notice app with its synthetic test fixture, without live accounts."""
import sys
from pathlib import Path
import importlib.util

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/priya/OneDrive/Desktop/CODING/Projects/MMMUT_Notice')
sys.path.insert(0, str(source))
spec = importlib.util.spec_from_file_location('notice_fixture', source / 'tests/test_mvp.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
from mmmut_notice.web import admin_index, public_index, STYLE
from mmmut_notice.workflow import approve_notice, publish_notice

fixture = module.MVPTests()
fixture.setUp()
try:
    fixture._draft()
    review = admin_index(fixture.db, {})
    approve_notice(fixture.db, fixture.id, 'reviewer@example.com')
    publish_notice(fixture.db, fixture.id, 'admin@example.com')
    public = public_index(fixture.db, {})
    for name, html in [('review', review), ('hub', public)]:
        html = html.replace('<link rel="stylesheet" href="/style.css">', '<style>' + STYLE + '</style>')
        html = html.replace('<script src="/ui.js" defer></script>', '')
        html = html.replace('<main id="main-content">', '<main id="main-content"><p style="font-size:12px;color:#64738a">Portfolio capture · synthetic fixture from the project test suite</p>')
        (root / 'public' / f'__qa-notice-{name}.html').write_text(html, encoding='utf-8')
finally:
    fixture.doCleanups()
