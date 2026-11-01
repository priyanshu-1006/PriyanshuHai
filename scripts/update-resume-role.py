"""Update the GDGoC line in the existing image-based resume, preserving its layout."""
from pathlib import Path
import fitz

root = Path(__file__).resolve().parents[1]
document = fitz.open(root / 'public/resume.pdf')
page = document[0]
# The original is a single raster page. Cover only the role heading; retain the bullet.
page.draw_rect(fitz.Rect(38, 367.7, 558, 380), color=None, fill=(1, 1, 1))
role = 'Organiser & Campus Lead'
org = ', GDGoC, MMMUT'
size = 9.5
page.insert_text((39.6, 376.35), role, fontname='tibo', fontsize=size)
role_width = fitz.get_text_length(role, fontname='tibo', fontsize=size)
page.insert_text((39.6 + role_width, 376.35), org, fontname='tiit', fontsize=size)
date = 'Sep 2026 - Present'
date_width = fitz.get_text_length(date, fontname='tibo', fontsize=size)
page.insert_text((556.5 - date_width, 376.35), date, fontname='tibo', fontsize=size)
output = document.tobytes(garbage=4, deflate=True)
document.close()
(root / 'public/resume.pdf').write_bytes(output)
(root / 'resume/Resume.pdf').write_bytes(output)
with fitz.open(stream=output, filetype='pdf') as result:
    result[0].get_pixmap(matrix=fitz.Matrix(1.5, 1.5)).save(root / 'docs/qa/resume-updated.png')
    assert 'Organiser & Campus Lead' in result[0].get_text()
