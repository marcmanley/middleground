# XML Sitemap

Last reviewed: 2026-07-18

This document describes a **working system already implemented in this repository** — not a recommendation. It was built to satisfy the same requirement this documentation task also covers (a self-maintaining `sitemap.xml`), so unlike most of `/docs`, this file mostly reports "how it already works" rather than "what's missing."

## Sitemap URL

`https://www.muslim.center/sitemap.xml` — a static file at the project root, served directly by Vercel (no server-side generation at request time).

## Manually maintained or automatically generated?

**Automatically generated**, by [`generate-sitemap.js`](../generate-sitemap.js) (project root, plain Node, no dependencies). It is not hand-edited.

## Which files, routes, or content sources feed it

The script scans the filesystem directly — there is no CMS, database, or route config to read instead, since every page is a plain `.html` file (see [site-map.md](site-map.md)):

- Every `*.html` file directly in the project root (`PAGE_DIRS = ['', 'blog']` in the script).
- Every `*.html` file in `/blog/`.

One file on disk = one candidate URL. Adding a new `.html` file to either location is picked up automatically the next time the generator runs — no separate "register this page" step exists or is needed.

## Pages included

All 25 currently: `/`, `/about.html`, `/imam.html`, `/learning.html`, `/contact.html`, `/blog/index.html`, and the 19 posts in `/blog/`. Full list with per-page detail in [site-map.md](site-map.md).

## Pages excluded, and how

The generator applies two exclusion rules while scanning (see the comment block at the top of `generate-sitemap.js` for the authoritative description):

1. **`<meta name="robots" content="...noindex...">`** — if present anywhere in a page's HTML, that page is skipped entirely.
2. **A `<link rel="canonical" href="...">` pointing at a different URL than the page's own** — the page is treated as a duplicate of whatever it declares canonical, and skipped (the canonical target is what gets listed, and only if it's a real page the scanner also finds on its own).

Both rules were verified working during implementation by adding a synthetic test page with each condition and confirming it was excluded from the output, then removing the test page.

**As of this review, neither condition is present anywhere on the live site** (0 of 25 pages have `noindex` or a canonical tag — see [schema.md](schema.md) and [site-map.md](site-map.md)), so today the exclusion logic has nothing to exclude. It exists so that adding a draft/noindex page in the future is safe by default, without needing to remember to edit the sitemap by hand.

Non-page paths (`media/`, `brand_assets/`, `api/`, `node_modules/`, `temporary screenshots/`, `.claude/`) are never scanned in the first place — they're outside `PAGE_DIRS`, so they can't accidentally appear in the sitemap regardless of their content.

## How `lastmod` is generated

For each included page, the script shells out to `git log -1 --format=%cI -- <file>` and takes the date portion (`YYYY-MM-DD`) of that file's most recent commit. If git is unavailable or the file has no history (wrapped in a try/catch), `lastmod` is simply omitted for that URL rather than guessed — the generator never fabricates a date, per the project's own requirement that `lastmod` only appear when a reliable source exists.

**Known data quality caveat:** because the most recent commit (`adebc99`, "Tweaking the footer. Adding a map.") touched all 25 files at once (it edited every page's shared footer), every page in the current sitemap shows the same `lastmod` date. This is an accurate reflection of each file's real last-changed commit — it isn't a bug in the generator — but it means `lastmod` currently can't be used to tell which pages have *meaningfully* changed recently, only that the footer was touched everywhere on that date. The next time only one page is edited, its `lastmod` will correctly diverge from the rest.

## How sitemap generation is tied to the production build

- `package.json`: `"scripts": { "build": "node generate-sitemap.js" }`
- `vercel.json`: `"buildCommand": "npm run build"`

Every Vercel production deploy runs `npm run build` before publishing, which regenerates `sitemap.xml` from whatever `.html` files exist in the repo at deploy time. There is no separate manual step.

## How to test it locally

1. `node generate-sitemap.js` — regenerates `sitemap.xml` in the project root. It prints a count, e.g. `sitemap.xml written with 25 URL(s).`
2. Open `sitemap.xml` directly and check the `<loc>` list.
3. `node serve.mjs` (serves the project at `http://localhost:3000`), then visit `http://localhost:3000/sitemap.xml`. `serve.mjs` maps the `.xml` extension to `application/xml; charset=utf-8` and `.txt` to `text/plain; charset=utf-8`, so both `sitemap.xml` and `robots.txt` serve with correct content types locally, matching production.

## How to verify it after deployment

- Visit `https://www.muslim.center/sitemap.xml` directly and confirm it returns XML (not a 404) and lists the expected pages.
- Confirm `https://www.muslim.center/robots.txt` references the same sitemap URL (see [robots.md](robots.md)).
- In Google Search Console (if/when connected — see "What I could not determine" below), submit the sitemap URL under Sitemaps and check the "Discovered URLs" count against the known page count in [site-map.md](site-map.md).

## How to add a new page so it appears automatically

Create the `.html` file in the project root or in `/blog/`, commit, and push. The next Vercel build runs `npm run build`, which rescans the filesystem and includes the new file automatically — no manual edit to `sitemap.xml` is needed or expected.

## How to intentionally exclude a page

Add either of the following to the page's `<head>`:

- `<meta name="robots" content="noindex">` — excludes it outright.
- `<link rel="canonical" href="https://www.muslim.center/some-other-page.html">` — excludes it as a duplicate of another page.

## Search Console / Bing Webmaster Tools status

Resolved as of 2026-07-18 (per site owner): Google Search Console is verified for this domain. Bing Webmaster Tools is not yet set up. See [seo-roadmap.md](seo-roadmap.md) item 6 for the specific remaining steps in each (submitting the sitemap, checking the Pages report, etc.) — that's tracked there rather than duplicated here since it's an ongoing action item, not a fact about how the sitemap itself works.
