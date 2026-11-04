"""Generate a portable academic site and its downloadable CV. No web build tools required."""
import html
import json
import os
import sys
import re
import shutil
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent
DIST = ROOT.parent
CONTENT = json.loads((ROOT / "content.json").read_text())
SITE_URL = os.environ.get("SITE_URL", "https://mdobaidullah.com").rstrip("/")
EMAIL = "buobaidullah@gmail.com"
SCHOLAR = "https://scholar.google.com/citations?user=lSusWyYAAAAJ&hl=en"
LINKEDIN = "https://www.linkedin.com/in/md-obaidullah-14322b154/"
KINDS = [("article", "Journal articles"), ("chapter", "Book chapters"), ("review", "Book reviews")]
PAPERS = CONTENT["publications"]
NAV = [("index.html", "Home"), ("research.html", "Research"), ("publications.html", "Publications"), ("writing.html", "Public Writing"), ("teaching.html", "Teaching"), ("cv.html", "CV")]
E = html.escape


def authors(p):
    names = p["authors"]
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return " and ".join(names)
    return ", ".join(names[:-1]) + ", and " + names[-1]


def article(p, home=False, with_search=True):
    title = E(p["title"])
    href = "publications.html#" + p["id"] if home else p.get("url")
    heading = f'<a href="{E(href)}">{title}</a>' if href else title
    metadata = f'{E(authors(p))}. {p["y"]}. <cite>{E(p["venue"])}</cite>'
    if p.get("detail"):
        metadata += ", " + E(p["detail"])
    metadata += "."
    actions = ""
    if p.get("url"):
        label = "Read essay" if p["t"] == "public" else "Article"
        actions = f'<div class="publication-actions"><a href="{E(p["url"])}">{label}<span class="visually-hidden">: {title}</span></a></div>'
    terms = " ".join([p["title"], p["venue"], str(p["y"]), authors(p), p["th"]])
    attrs = f' data-publication data-type="{p["t"]}" data-search="{E(terms)}"' if with_search else ""
    return f'<li class="publication" id="{p["id"]}"{attrs}><h3 class="publication-title">{heading}</h3><p class="publication-meta">{metadata}</p>{actions}</li>'


def page(filename, title, description, body):
    nav = "".join(f'<a href="{url}"{(" aria-current="+chr(34)+"page"+chr(34)) if url == filename else ""}>{name}</a>' for url, name in NAV)
    canonical = SITE_URL + ("/" if filename == "index.html" else "/" + filename)
    schema = {"@context": "https://schema.org", "@type": "Person", "name": "Md. Obaidullah", "url": SITE_URL, "jobTitle": "PhD Student in Politics", "affiliation": {"@type": "CollegeOrUniversity", "name": "University of Virginia"}, "sameAs": [SCHOLAR, LINKEDIN]}
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)} | Md. Obaidullah</title><meta name="description" content="{E(description)}">
<meta name="theme-color" content="#263f50"><link rel="canonical" href="{canonical}">
<meta property="og:title" content="{E(title)} | Md. Obaidullah"><meta property="og:description" content="{E(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{SITE_URL}/portrait.jpg">
<link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="stylesheet" href="styles.css"><script src="site.js" defer></script>
<script type="application/ld+json">{json.dumps(schema)}</script>
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap"><div class="masthead"><p class="site-name"><a href="index.html">Md. Obaidullah</a></p><p class="affiliation"><a href="https://politics.virginia.edu/">Department of Politics</a><span class="affiliation-divider" aria-hidden="true"> · </span><br><a href="https://www.virginia.edu/">University of Virginia</a></p></div><nav class="primary-nav" aria-label="Main navigation">{nav}</nav></header>
<main class="wrap" id="main">{body}</main>
<footer class="site-footer wrap"><p>Md. Obaidullah · University of Virginia · <a href="mailto:{EMAIL}">Email</a></p><p>Updated November 2026</p></footer>
</body></html>'''


def selected(prefix):
    return next(p for p in PAPERS if p["title"].startswith(prefix))


def home():
    picks = [selected("Regime Collapse"), selected("Machiavellian"), selected("Delivering Attraction")]
    return f'''<div class="profile">
<div class="biography"><h1>About</h1>
<p>I am a PhD student in the <a href="https://politics.virginia.edu/">Department of Politics at the University of Virginia</a>, where I study international relations and political methodology.</p>
<p>My research focuses on international conflict and security, foreign policy, and great power competition. I am particularly interested in how domestic politics shapes states’ relations with external powers. Much of my work examines South Asia, with additional research on the Middle East, migration, refugees, and border politics.</p>
<p>I use quantitative analysis, qualitative case studies, and computational methods. Before joining UVA, I earned an MA in Political Science from the University of Southern Mississippi and taught in the Department of Development Studies at Daffodil International University. I hold bachelor’s and master’s degrees in Public Administration from the University of Barishal, Bangladesh.</p>
<div class="inline-links"><a href="research.html">Research</a><a href="obaidullah-cv.pdf">Curriculum vitae (PDF)</a><a href="{SCHOLAR}">Google Scholar</a></div></div>
<aside aria-label="Portrait and contact"><img class="portrait" src="portrait.jpg" alt="Md. Obaidullah" width="520" height="650" fetchpriority="high"><div class="contact-details"><p>Department of Politics<br>University of Virginia<br>Charlottesville, Virginia</p><p><a href="mailto:{EMAIL}">{EMAIL}</a></p><p class="contact-links"><a href="{SCHOLAR}">Google Scholar</a><a href="{LINKEDIN}">LinkedIn</a></p></div></aside></div>
<section class="section" aria-labelledby="selected-publications"><div class="section-heading"><h2 id="selected-publications">Selected publications</h2><a href="publications.html">All publications →</a></div><ul class="publication-list">{"".join(article(p,home=True,with_search=False) for p in picks)}</ul></section>
<section class="section" aria-labelledby="news"><div class="section-heading"><h2 id="news">Recent news</h2></div><ul class="news"><li><time datetime="2026-10">October 2026</time><span>“<a href="https://doi.org/10.1177/20578911261492941">Regime Collapse without Civil War</a>,” coauthored with Rakia Begum, published online in <cite>Asian Journal of Comparative Politics</cite>.</span></li><li><time datetime="2026">2026</time><span>Awarded the John L. Nau III Graduate Fellowship at the University of Virginia.</span></li></ul></section>'''


def research():
    working = [p for p in PAPERS if p["t"] == "working"]
    return f'''<header class="page-intro"><h1>Research</h1><p>International relations, domestic politics, and the external relations of states in South Asia and the Middle East.</p></header>
<div class="reading-column">
<section class="research-section"><h2>Foreign policy and great power competition</h2><p>I study how states respond to competition among larger powers, and how domestic political concerns shape those choices. My work examines Chinese soft power and Belt and Road implementation in Bangladesh and Pakistan, Qatar’s relations with the United States and China, and the role of external powers in South Asian politics.</p><p class="paper-note">Related work: <a href="https://doi.org/10.1177/00094455261424404">Delivering Attraction?</a> (<cite>China Report</cite>, 2026).</p></section>
<section class="research-section"><h2>Conflict, repression, and regime survival</h2><p>My research on political conflict examines repression, authoritarian politics, and the conditions under which mass protest produces regime change. I connect cross-national analysis with process tracing, including work on Bangladesh’s July 2024 uprising.</p><p class="paper-note">Related work: <a href="https://doi.org/10.1177/20578911261492941">Regime Collapse without Civil War</a> (<cite>Asian Journal of Comparative Politics</cite>, 2026) and <a href="https://doi.org/10.1080/09584935.2026.2690148">Machiavellian and Hobbesian Foundations of Democratic Decline in Bangladesh</a> (<cite>Contemporary South Asia</cite>, 2026).</p></section>
<section class="research-section"><h2>Migration, refugees, and border politics</h2><p>I also study the international and domestic politics of displacement and borders. This work addresses the Rohingya crisis and Bangladesh–Myanmar relations, India–Bangladesh border and water disputes, and the experiences of undocumented Bangladeshi migrants.</p><p class="paper-note">Related work: <a href="https://doi.org/10.1007/s44282-025-00137-0">India–Bangladesh Water Disputes</a> (<cite>Discover Global Society</cite>, 2025). See also <a href="publications.html#book-chapters">book chapters on the Rohingya crisis</a>.</p></section>
<section class="research-section"><div class="section-heading"><h2>Work in progress</h2></div>{''.join('<article class="working-paper"><h3>'+E(p['title'])+'</h3><p class="paper-note">'+E(p['venue'])+'</p><p><a href="mailto:'+EMAIL+'?subject=Manuscript%20request">Request manuscript</a></p></article>' for p in working)}</section>
<section class="research-section"><h2>Master’s thesis</h2><p><em>Diversionary Repression in Electoral Autocracies: Crisis Onset, Loss-Domain Conditions, and State Escalation.</em></p><p class="paper-note">University of Southern Mississippi, 2026. Committee: Joe Weinberg (chair), Marek Steedman, and Maggie K. Martin.</p></section>
<section class="research-section"><h2>Methods</h2><p>I combine causal inference and panel-data analysis with process tracing, comparative case studies, and interviews. My methodological interests also include survey experiments and computational social science.</p></section></div>'''


def search_controls(noun, total, with_type=False):
    type_control = '<div class="type-field"><label for="publication-type">Publication type</label><select id="publication-type"><option value="all">All types</option>'+''.join(f'<option value="{k}">{name}</option>' for k,name in KINDS)+'</select></div>' if with_type else ''
    return f'''<div class="search-tools"><div class="search-field"><label for="publication-search">Search {noun}s</label><input id="publication-search" type="search" placeholder="Title, author, journal, or year" autocomplete="off" aria-controls="search-results"></div>{type_control}<output id="search-count" class="search-count" aria-live="polite">{total} {noun}s</output></div>'''


def publications():
    records = [p for p in PAPERS if p['t'] in ['article','chapter','review']]
    body = '<header class="page-intro"><h1>Publications</h1><p>Journal articles, book chapters, and book reviews. <a href="research.html">Current research</a> and <a href="writing.html">public writing</a> are listed separately.</p></header>'
    anchors = ['journal-articles','book-chapters','book-reviews']
    body += '<nav class="jump-links" aria-label="Publication sections">'+''.join(f'<a href="#{anchor}">{name}</a>' for anchor,(_,name) in zip(anchors,KINDS))+'</nav>'
    body += search_controls('publication',len(records),True)+'<div id="search-results" data-search-list="publication">'
    for anchor,(kind,name) in zip(anchors,KINDS):
        body += f'<section class="bibliography-section" id="{anchor}" data-publication-section><h2>{name}</h2><ul class="publication-list">'+''.join(article(p) for p in sorted(records,key=lambda x:x['y'],reverse=True) if p['t']==kind)+'</ul></section>'
    body += '</div><div class="empty-state" id="empty-state" hidden><p>No publications match your search.</p><button class="text-button" data-reset-search>Clear search and filters</button></div>'
    return body


def writing():
    records = [p for p in PAPERS if p['t']=='public']
    body = '<header class="page-intro"><h1>Public Writing</h1><p>Essays and commentary on international security, South Asian politics, and great power competition.</p></header>'
    body += search_controls('essay',len(records))+'<div id="search-results" data-search-list="essay">'
    for year in sorted({p['y'] for p in records},reverse=True):
        body += f'<section class="bibliography-section" data-publication-section><h2>{year}</h2><ul class="publication-list">'+''.join(article(p) for p in records if p['y']==year)+'</ul></section>'
    body += '</div><div class="empty-state" id="empty-state" hidden><p>No essays match your search.</p><button class="text-button" data-reset-search>Clear search</button></div>'
    return body


def teaching():
    courses = [
      ('Fall 2025','Introduction to Law in American Society','PS 380 · Instructor: Troy Gibson'),
      ('Fall 2025','U.S. Constitutional Law','PS 480 · Instructor: Troy Gibson'),
      ('Fall 2025','Research Methods','SSGS 400 · Instructor: Troy Gibson'),
      ('2024–2025','American Government','PS 101 · Three sections · Instructor: Bob Press'),
      ('2024–2025','Race and Ethnic Politics','PS 306 · Two sections · Instructor: Bob Press'),
      ('2024–2025','Politics and Protests','PS 453 · Instructor: Bob Press')]
    rows = ''.join(f'<li><span class="course-date">{date}</span><span><span class="course-name">{name}</span><span class="course-detail">{detail}</span></span></li>' for date,name,detail in courses)
    return f'''<header class="page-intro"><h1>Teaching</h1><p>My teaching experience includes serving as an instructor at Daffodil International University and as a teaching assistant at the University of Southern Mississippi.</p></header><div class="reading-column">
<section class="teaching-role"><h2>Instructor</h2><p>Daffodil International University · Department of Development Studies</p><ul class="course-list"><li><span class="course-date">Spring 2024</span><span><span class="course-name">Introduction to Bangladesh Studies</span><span class="course-detail">BNS 101 · Instructor of record · Six sections</span></span></li></ul></section>
<section class="teaching-role"><h2>Teaching assistant</h2><p>University of Southern Mississippi</p><ul class="course-list">{rows}</ul></section>
<section class="teaching-role"><h2>Teaching interests</h2><ul class="teaching-interests"><li>Introduction to International Relations</li><li>Foreign Policy Analysis</li><li>International Security and Conflict</li><li>Politics of South Asia</li><li>Migration and Refugee Politics</li><li>Undergraduate Research Methods</li></ul></section>
<p class="paper-note section">Sample syllabi and teaching evaluations are available <a href="mailto:{EMAIL}?subject=Teaching%20materials">on request</a>.</p></div>'''


def cv_section(section):
    rows = ''.join(f'<li><span class="cv-date">{E(r["date"])}</span><span><span class="cv-title">{E(r["title"])}</span><span class="cv-detail">{E(r["description"])}</span></span></li>' for r in section['rows'])
    return '<section class="cv-section"><h2>'+E(section['title'])+'</h2><ul class="cv-list">'+rows+'</ul></section>'


def cv():
    body = '<header class="page-intro"><div class="cv-topline"><h1>Curriculum Vitae</h1><a class="download-link" href="obaidullah-cv.pdf" download>Download CV (PDF) ↓</a></div></header>'
    for section in CONTENT['cv_sections']:
        body += cv_section(section)
        if section['title']=='Academic appointments':
            body += '<section class="cv-section"><h2>Publications</h2><p>See the <a href="publications.html">publication list</a> for journal articles, book chapters, and book reviews, and <a href="writing.html">Public Writing</a> for essays and commentary. The downloadable CV includes the complete bibliography listed on this website.</p></section>'
    journals = '; '.join(j for j,n in CONTENT['review_journals'])
    body += '<section class="cv-section"><h2>Scholarly service</h2><p>Peer reviewer for '+E(journals)+'.</p></section>'
    body += '<section class="cv-section"><h2>Skills and languages</h2><dl class="skill-list">'+''.join('<div><dt>'+E(s['title'])+'</dt><dd>'+E(s['description'])+'</dd></div>' for s in CONTENT['skills'])+'</dl></section>'
    return body


def create_pdf():
    output = ROOT/'output'/'pdf'
    output.mkdir(parents=True,exist_ok=True)
    pdf = output/'obaidullah-cv.pdf'
    import matplotlib
    font_root = Path(matplotlib.get_data_path())/'fonts'/'ttf'
    for suffix,filename in [('', 'DejaVuSerif.ttf'),('-Bold','DejaVuSerif-Bold.ttf'),('-Italic','DejaVuSerif-Italic.ttf'),('-BoldItalic','DejaVuSerif-BoldItalic.ttf')]:
        pdfmetrics.registerFont(TTFont('CVSerif'+suffix,str(font_root/filename)))
    pdfmetrics.registerFontFamily('CVSerif',normal='CVSerif',bold='CVSerif-Bold',italic='CVSerif-Italic',boldItalic='CVSerif-BoldItalic')
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CVName',fontName='CVSerif',fontSize=23,leading=28,spaceAfter=8))
    styles.add(ParagraphStyle(name='CVBody',fontName='CVSerif',fontSize=10,leading=13.5,spaceAfter=5))
    styles.add(ParagraphStyle(name='CVSection',fontName='CVSerif-Bold',fontSize=13,leading=17,spaceBefore=11,spaceAfter=6,keepWithNext=True))
    styles.add(ParagraphStyle(name='CVSmall',fontName='CVSerif',fontSize=9,leading=12,spaceAfter=3))
    def ascii_dashes(text):
        return text.replace('–','-').replace('—','-').replace('\u2011','-')
    def para(text,style='CVBody'):
        return Paragraph(ascii_dashes(text),styles[style])
    def section(title):
        story.append(para(escape(title),'CVSection'))
    story = [para('Md. Obaidullah','CVName'),para('Department of Politics, University of Virginia<br/>Charlottesville, Virginia<br/><link href="mailto:'+EMAIL+'">'+EMAIL+'</link> | <link href="https://mdobaidullah.com/">mdobaidullah.com</link>','CVSmall'),para('Curriculum Vitae | November 2026','CVSmall')]
    def add_rows(s):
        for i,row in enumerate(s['rows']):
            group = [para(escape(s['title']),'CVSection')] if i==0 else []
            group += [para('<b>'+escape(row['date'])+'</b> &nbsp; '+escape(row['title']), 'CVBody'),para(escape(row['description']),'CVSmall')]
            story.append(KeepTogether(group))
    for s in CONTENT['cv_sections'][:2]:add_rows(s)
    for kind,title in KINDS+[('working','Working papers'),('public','Public writing')]:
        section(title)
        for p in sorted(PAPERS,key=lambda x:x['y'],reverse=True):
            if p['t']!=kind:continue
            title_markup = escape(p['title'])
            if p.get('url'):title_markup='<link href="'+escape(p['url'])+'" color="#245675">'+title_markup+'</link>'
            text=escape(authors(p))+'. '+str(p['y'])+'. “'+title_markup+'.” <i>'+escape(p['venue'])+'</i>'
            if p.get('detail'):text+=', '+escape(p['detail'])
            story.append(para(text+'.'))
    for s in CONTENT['cv_sections'][2:]:add_rows(s)
    section('Scholarly service')
    story.append(para('Peer reviewer: '+escape('; '.join(j for j,n in CONTENT['review_journals']))+'.'))
    section('Skills and languages')
    for s in CONTENT['skills']:story.append(para('<b>'+escape(s['title'])+':</b> '+escape(s['description'])))
    def footer(canvas,doc):
        canvas.saveState();canvas.setFont('CVSerif',9);canvas.setFillColor(colors.HexColor('#666666'))
        canvas.drawString(0.7*inch,0.38*inch,'Md. Obaidullah | Curriculum Vitae')
        canvas.drawRightString(7.8*inch,0.38*inch,str(doc.page));canvas.restoreState()
    doc=SimpleDocTemplate(str(pdf),pagesize=(8.5*inch,11*inch),rightMargin=.7*inch,leftMargin=.7*inch,topMargin=.6*inch,bottomMargin=.65*inch,title='Curriculum Vitae - Md. Obaidullah',author='Md. Obaidullah')
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    shutil.copy2(pdf,DIST/'obaidullah-cv.pdf')


def build():
    DIST.mkdir(exist_ok=True)
    for source,target in [('styles.css','styles.css'),('site.js','site.js'),('portrait.jpg','portrait.jpg')]:shutil.copy2(ROOT/'assets'/source,DIST/target)
    pages = [
     ('index.html','Home','Md. Obaidullah is a PhD student in Politics at the University of Virginia. Research on international security, foreign policy, and great power competition.',home()),
     ('research.html','Research','Research on foreign policy, great power competition, repression, migration, and border politics.',research()),
     ('publications.html','Publications','Journal articles, book chapters, and book reviews by Md. Obaidullah.',publications()),
     ('writing.html','Public Writing','Essays and commentary by Md. Obaidullah on South Asian politics, international security, and great power competition.',writing()),
     ('teaching.html','Teaching','Teaching experience and interests of Md. Obaidullah.',teaching()),
     ('cv.html','Curriculum Vitae','Education, academic experience, publications, and service of Md. Obaidullah. Download a PDF CV.',cv())]
    for filename,title,description,body in pages:(DIST/filename).write_text(page(filename,title,description,body))
    (DIST/'404.html').write_text(page('404.html','Page not found','Page not found.','<h1>Page not found</h1><p>The page may have moved. Visit the <a href="index.html">home page</a> or browse <a href="publications.html">publications</a>.</p>'))
    (DIST/'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#263f50"/><text x="24" y="32" text-anchor="middle" fill="white" font-family="Georgia,serif" font-size="25">O</text></svg>')
    (DIST/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+SITE_URL+'/sitemap.xml\n')
    (DIST/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+SITE_URL+('/' if file=='index.html' else '/'+file)+'</loc></url>' for file,*_ in pages)+'</urlset>')
    if '--skip-pdf' not in sys.argv:
        create_pdf()
    print('Built 6 pages, a 404 page, and a downloadable CV. Bibliography entries:',len(PAPERS))


if __name__=='__main__':build()
