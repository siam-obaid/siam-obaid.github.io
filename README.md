# Md. Obaidullah — academic website

Academic website for Md. Obaidullah, PhD student in Politics at the University of Virginia.

Live website: https://mdobaidullah.com/

## Publishing

GitHub Pages serves the prebuilt files in the repository root from `main`. No build step or installation is needed to serve the website. Keep `CNAME` and `.nojekyll` in place. The custom domain and existing publishing configuration are preserved.

## Updating the website

- Edit `source/content.json` to update publications and CV entries.
- Edit `source/build.py` to update biography, research, teaching, blog, and other page copy.
- Edit `source/assets/styles.css` for layout and typography.
- Edit `source/assets/site.js` for optional publication search.
- Replace `source/assets/portrait.jpg` to update the portrait.

Install the generator dependencies and regenerate the root files:

```bash
python3 -m pip install -r source/requirements.txt
python3 source/build.py
```

For page-only changes, `python3 source/build.py --skip-pdf` keeps the existing CV PDF. Commit the generated root files with their source changes. Publishing continues through the existing GitHub Pages configuration.

The site uses Palatino when installed, with a self-hosted TeX Gyre Pagella web font for matching typography on other devices. The cool slate background and typography are shared across all pages. Font files and their license are in `source/assets/fonts/`, copied to `fonts/` by the generator. The site loads no trackers, external font services, or external JavaScript. All publication records are included directly in HTML and remain readable without JavaScript. Search and publication-type filters are optional enhancements.

## CV

`obaidullah-cv.pdf` is a reconstructed CV generated from the public web CV and bibliography. It replaces a missing download. To use a separately maintained master CV, replace the PDF and keep the same filename.

## Content provenance

The redesign retains all 39 bibliography entries from the previous public site. Verified publication corrections, sources, and earlier migration notes are recorded in `CONTENT-NOTES.md`. The previous version remains available in Git history.
