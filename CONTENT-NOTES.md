# Content and verification notes

Updated November 4, 2026.

The current design is an academic redesign of the public site. All 39 bibliography entries were retained: 25 journal articles, chapters, and book reviews; one current working paper; and 13 public essays.

## Second-pass website audit — November 4, 2026

- Fixed section links when their publication category was hidden by a search or type filter.
- Fixed the missing-page screen’s asset and navigation paths so recovery works from nested addresses; excluded that screen from indexing.
- Kept result counts visible on mobile, added a keyboard-focus target for the skip link, and increased input and placeholder contrast.
- Added 29 confirmed source links. All 25 scholarly publication records now link to a work or a clearly labelled publisher issue/contents page; 10 of 13 essays have source links.
- Completed citation details from publisher metadata. Corrected the first-online years of living-reference entries, used final issue years for paginated reviews, corrected the Sirajgonj title spelling, and corrected the coauthor initials for Habib Mohammad Ali and Zobayer Ahmed.
- Regenerated the PDF CV from the same corrected bibliography and checked its rendered pages and link annotations.
- Checked page structure, local links and fragments, search/filter behavior, missing-page recovery, keyboard focus, and all six layouts at phone widths. HTTPS and www redirects, main-page responses, assets, and the CV download were also checked.

The following essay source URLs remain unconfirmed and their titles remain plain text: “Invisible Diplomats” (New Age); “CPEC’s Afghan Push Poses a New Challenge for India” (East Asia Forum); “Rohingya Crisis Demands More Than Paper Promises” (New Age). The publication records themselves were retained from the owner’s previous site.

## Current changes

- Replaced the sidebar and promotional headline with a first-person biography, a modest portrait, and conventional academic navigation and publication lists.
- Preserved the six existing page routes, contact links, custom domain, and GitHub Pages configuration.
- Moved “Regime Collapse without Civil War” from working papers to journal articles and added coauthor Rakia Begum, following the publisher record: https://doi.org/10.1177/20578911261492941
- Updated the Contemporary South Asia citation to 34(3), 554–579, following the publisher issue: https://www.tandfonline.com/toc/ccsa20/34/3
- Added verified publisher links for selected articles and essays. Titles with no confirmed link remain plain text.
- Rebuilt the missing PDF CV from the public web CV and bibliography. It is a reconstruction of the public record, rather than a separately supplied master CV. Other historical CV entries and publication metadata retain the previous public site’s information.
- Publication lists are present in the HTML. Search is an optional enhancement, so the lists remain available without JavaScript.

## Editing and validation

The editable bibliography and CV data are in `source/content.json`. The generator and page copy are in `source/build.py`; styling and optional search are in `source/assets/`. Local links and fragments, JavaScript syntax, publication counts, responsive layouts, and search/filter behavior were checked. The PDF was rendered and visually inspected.

## Historical migration notes

The following notes describe the earlier September migration and are retained for provenance. They do not describe the current layout or current bundled assets.

# Content provenance and migration notes

Prepared September 14, 2026 for Md. Obaidullah.

## Sources

- Homepage: https://mdobaidullah.com/
- Research: https://mdobaidullah.com/researches/research/
- Publications: https://mdobaidullah.com/publication/publications/
- Experience: https://mdobaidullah.com/work-experience/
- Contact: https://mdobaidullah.com/contact/
- Public CV: https://mdobaidullah.com/wp-content/uploads/2026/05/CV_Md_Obaidullah_April_2026.pdf

The content was read through the available web retrieval service. Some subpages were older cached versions. Direct file downloads were unavailable, so the existing photo and PDF are not bundled.

## Editorial choices to review

- The homepage says PhD student in Politics at the University of Virginia, updating the source homepage's “incoming” Fall 2026 wording for September 2026.
- The contact email is the address in the public CV: buobaidullah@gmail.com. The previous Mississippi office address has been omitted; no new office address is invented.
- `cv.html` is a reconstructed web CV, not the original PDF or a certified current/full CV. It includes education, published work, experience, service, training, and selected public writing. Phone, references, volunteering, and time-sensitive working-paper statuses are omitted.
- Publication records combine the existing publication page with the April 2026 CV. Most recent status changes after that CV are not independently confirmed. Review 2026 article metadata, affiliation, experience dates, and publication completeness before publishing.
- The East Asia Forum item listed under peer-reviewed articles in the source CV has not been repeated as a journal article here. Public commentary is kept separate.
- Titles without a confirmed link are displayed as text; no DOI or URL has been invented. Included external links were copied from the source, not exhaustively revalidated.
- Public writing is a selected collection. The redesign is not a complete archive of every commentary item.
- The original homepage's unrelated casino content and unfinished template heading were removed. A visitor counter was omitted because no reliable count or compatible data source was available.
- The old server-dependent contact form is replaced by a working mailto link.
- Known old top-level navigation URLs redirect to the new sections. Other WordPress URLs and uploaded attachments are not automatically migrated.
- To retain old PDF links after a domain switch, obtain the original PDF from your WordPress media library and upload it at its original `wp-content/uploads/...` path, or update any external references to the new CV page.
- The current design is typography-led. A real portrait can be added when a working original photo is supplied; no substitute identity image was generated.

## Verification

Local HTML pages, fragments, CSS/JavaScript references, and redirected navigation targets were checked. JavaScript syntax was checked with Node. No live GitHub deployment or browser visual test was performed.
