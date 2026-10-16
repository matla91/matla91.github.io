"""Regenerate the public one-page CV. Requires reportlab; no private source data."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
root = Path(__file__).resolve().parent.parent
data = json.loads((root/'src/content/cv.json').read_text())
font_dir=Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('CV',str(font_dir/'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('CVBold',str(font_dir/'DejaVuSans-Bold.ttf')))
styles={
 'name':ParagraphStyle('name',fontName='CVBold',fontSize=25,leading=28,spaceAfter=8,textColor=HexColor('#010409')),
 'role':ParagraphStyle('role',fontName='CV',fontSize=10,leading=14,spaceAfter=9),
 'body':ParagraphStyle('body',fontName='CV',fontSize=8,leading=12,textColor=HexColor('#454545'),spaceAfter=7),
 'tiny':ParagraphStyle('tiny',fontName='CV',fontSize=7,leading=10,textColor=HexColor('#454545'),spaceAfter=6),
 'section':ParagraphStyle('section',fontName='CVBold',fontSize=8,leading=12,spaceBefore=12,spaceAfter=7,textColor=HexColor('#010409')),
 'title':ParagraphStyle('title',fontName='CVBold',fontSize=8.6,leading=12,spaceAfter=3,textColor=HexColor('#010409')),
}
def para(text,style='body'):return Paragraph(text,styles[style])
story=[para(escape(data['name']),'name'),para(escape(data['role']),'role'),para(f'<link href="mailto:{data["email"]}">{data["email"]}</link>  |  <link href="{data["github"]}">github.com/matla91</link>  |  <link href="{data["linkedin"]}">LinkedIn</link>','tiny'),Spacer(1,8),para(escape(data['summary']))]
for key,heading in [('experience','RESEARCH & PROFESSIONAL EXPERIENCE'),('education','EDUCATION'),('projects','SELECTED PROJECTS')]:
 story.append(para(heading,'section'))
 for item in data[key]:
  block=[para(escape(item['title']),'title')]
  if 'org' in item:block.append(para(escape(item['org'])+' | '+escape(item['date']),'tiny'))
  if 'text' in item:block.append(para(escape(item['text'])))
  if 'url' in item:block.append(para(f'<link href="{item["url"]}">View public repository</link>','tiny'))
  story.append(KeepTogether(block))
story += [para('TECHNICAL TOOLKIT','section'),para(escape(data['skills'])),para(escape(data['languages']),'tiny')]
def footer(canvas,doc):
 canvas.setStrokeColor(HexColor('#e4e4e4'));canvas.line(38,35,557,35)
 canvas.setFont('CV',6);canvas.setFillColor(HexColor('#737373'));canvas.drawString(38,23,'PUBLIC PORTFOLIO CV  /  UPDATED OCTOBER 2026');canvas.drawRightString(557,23,'matla91.github.io')
path=root/'public/cv/Matthis-Lahargoue-CV.pdf'
SimpleDocTemplate(str(path),pagesize=(595.28,841.89),rightMargin=38,leftMargin=38,topMargin=35,bottomMargin=45,title='Matthis Lahargoue - Machine Learning & Computational Imaging',author=data['name']).build(story,onFirstPage=footer,onLaterPages=footer)
print(path)
