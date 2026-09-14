# Md. Obaidullah — academic website

A lightweight, responsive website prepared for free GitHub Pages hosting. No installation, build command, paid theme, database, or WordPress plugins are required.

## Preview

Extract the ZIP and open `index.html` in your browser. Keep the folders together: the pages use `assets/style.css` and `assets/site.js`. The navigation and publication links work without a server. The CV page includes a Print / save as PDF button.

## Publish on GitHub Pages

1. Sign in to GitHub. Create a **public** repository named `YOUR-USERNAME.github.io`, substituting your actual GitHub username.
2. Upload the **contents** of this folder into the repository root, not the ZIP or its enclosing folder. `index.html` should appear at the top level alongside `assets/`, `publications.html`, and `cv.html`.
3. In **Settings → Pages**, select **Deploy from a branch**, **main**, and **/(root)**, then save.
4. Open the address shown in Settings → Pages. Publication can take several minutes. Confirm that the pages work before connecting your domain.

Official instructions: https://docs.github.com/en/pages/quickstart

## Keep mdobaidullah.com

Domain renewal remains separate from free hosting. After the GitHub version works:

1. Verify your domain in GitHub account settings and add `mdobaidullah.com` in the repository's **Settings → Pages → Custom domain** field.
2. At the provider managing your DNS, configure the apex domain's A records using the values in GitHub's current documentation below. The published values checked on September 14, 2026 are:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

Replace conflicting website A/AAAA/CNAME records, while preserving any MX and TXT records needed for email. Your DNS may be managed through hosting nameservers rather than Namecheap Advanced DNS; use the active DNS provider.

3. Enable **Enforce HTTPS** when GitHub makes it available. DNS and certificate setup can take up to 24 hours.
4. Check both `mdobaidullah.com` and `www.mdobaidullah.com`, publication links, and contact email. If you use hosting-based email, arrange replacement email service before canceling hosting.
5. Keep domain renewal active. Only cancel the old hosting after the new site works and the old website and email data are backed up.

No CNAME file is included initially so you can preview on the GitHub address before switching your live domain. Saving the custom domain for branch-based publishing creates that file.

Official domain instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Edit your website

- `index.html`: biography, research themes, selected work, experience, contact.
- `publications.html`: journal articles, chapters, reviews, selected public writing.
- `cv.html`: printable academic CV. Edit it independently when your record changes.
- `assets/style.css`: colors, typography, spacing, mobile layout, and print layout.
- `assets/site.js`: mobile navigation and the print button.

Edit the relevant file using GitHub's pencil button and commit the change. GitHub Pages republishes it. If a publication appears on more than one page, update each copy.

## Content notes

This is a redesign based on the public website and its April 2026 CV, not a complete WordPress export. See `CONTENT-NOTES.md` for sources and items to review before publishing. No account, repository, hosting subscription, or DNS setting has been changed.
