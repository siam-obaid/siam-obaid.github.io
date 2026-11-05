# Md. Obaidullah — academic website

Academic website for Md. Obaidullah, PhD student in Politics at the University of Virginia.

Live website: https://mdobaidullah.com/

## Publishing

GitHub Pages serves the prebuilt files in the repository root from `main`. No build step or installation is needed to serve the website. Keep `CNAME` and `.nojekyll` in place. The custom domain and existing publishing configuration are preserved.

## Updating the website

- Edit `source/content.json` to update publications and CV entries.
- Edit `source/build.py` to update biography, research, teaching, and other page copy.
- Edit `source/blog-listing.html` for the Blog index. Published article HTML lives in `source/posts/` and is copied to the repository root by the generator; the Sudan post’s original Markdown is retained there. Keep each post’s `data-post-views` slug registered in the view-counter service.
- Edit `source/assets/styles.css` for layout and typography.
- Edit `source/assets/site.js` for optional publication search.
- Replace `source/assets/portrait.jpg` to update the portrait.

Install the generator dependencies and regenerate the root files:

```bash
python3 -m pip install -r source/requirements.txt
python3 source/build.py
```

The generator copies the maintained CV from `source/assets/obaidullah-cv.pdf` and versions PDF links by its content hash. `python3 source/build.py --skip-pdf` also skips the legacy PDF fallback when no maintained PDF is present. Commit the generated root files with their source changes. Publishing continues through the existing GitHub Pages configuration.

The site uses Palatino when installed, with a self-hosted TeX Gyre Pagella web font for matching typography on other devices. The cool slate background and typography are shared across all pages. Font files and their license are in `source/assets/fonts/`, copied to `fonts/` by the generator. The site loads no trackers, external font services, or external JavaScript. All publication records are included directly in HTML and remain readable without JavaScript. Search and publication-type filters are optional enhancements.

## CV

`obaidullah-cv.pdf` is the current five-page academic CV exported from Overleaf on November 5, 2026. Its maintained source copy is `source/assets/obaidullah-cv.pdf`. To update it, replace that file and the root PDF with the same exported PDF, then update the Home and CV links to the PDF’s first 12 SHA-256 characters. The generator preserves the maintained PDF instead of replacing it with a reconstructed CV.

## Content provenance

The redesign retains all 39 bibliography entries from the previous public site. Verified publication corrections, sources, and earlier migration notes are recorded in `CONTENT-NOTES.md`. The previous version remains available in Git history.
