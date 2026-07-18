#!/usr/bin/env node
/*
 * Sitemap generator for the Middle Ground website.
 *
 * HOW IT WORKS
 *   Runs at build time (see the "build" script in package.json / vercel.json's
 *   buildCommand). It scans the filesystem for public HTML pages, applies the
 *   exclusion rules below, and writes sitemap.xml to the project root.
 *
 * WHICH FILES IT SCANS
 *   - Every *.html file directly in the project root (index.html, about.html, ...)
 *   - Every *.html file in blog/ (the blog index and each post)
 *   PAGE_DIRS below controls this. This is a plain static-HTML site (no
 *   framework/router), so scanning the filesystem for .html files IS scanning
 *   the site's routes -- one file equals one URL.
 *
 * WHICH PAGES IT EXCLUDES
 *   - Anything outside PAGE_DIRS (media/, brand_assets/, api/, node_modules/,
 *     "temporary screenshots/", .claude/, etc. are never considered pages).
 *   - Any page with <meta name="robots" content="...noindex..."> .
 *   - Any page whose <link rel="canonical" href="..."> points to a DIFFERENT
 *     URL than the page's own address (the page is telling crawlers the real
 *     URL lives elsewhere, so we list the canonical target instead, not the
 *     duplicate).
 *
 * HOW TO ADD A NEW PAGE SO IT APPEARS AUTOMATICALLY
 *   Just add the .html file to the project root or to blog/. The next build
 *   (or a manual `node generate-sitemap.js` / `npm run build`) will pick it up
 *   automatically -- nothing else to wire up.
 *
 * HOW TO INTENTIONALLY EXCLUDE A PAGE
 *   Add this to the page's <head>:
 *     <meta name="robots" content="noindex">
 *   or give it a canonical link pointing at the URL that should represent it
 *   instead:
 *     <link rel="canonical" href="https://www.muslim.center/other-page.html">
 *
 * HOW TO TEST LOCALLY
 *   1. node generate-sitemap.js
 *   2. Open the generated sitemap.xml and eyeball the <loc> list.
 *   3. node serve.mjs, then visit http://localhost:3000/sitemap.xml to
 *      confirm it's served correctly (serve.mjs maps .xml to
 *      application/xml).
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = __dirname;
const PRODUCTION_DOMAIN = 'https://www.muslim.center';

// Directories (relative to ROOT) to scan for public *.html pages.
// '' means "the project root itself" (non-recursive).
const PAGE_DIRS = ['', 'blog'];

function listHtmlFiles(dir) {
  const abs = path.join(ROOT, dir);
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => (dir ? `${dir}/${e.name}` : e.name));
}

function urlPathFor(relFile) {
  // index.html at the project root represents the homepage ("/").
  if (relFile === 'index.html') return '/';
  return `/${relFile}`;
}

function getMetaRobotsNoindex(html) {
  const match = html.match(
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i
  );
  return !!match && /noindex/i.test(match[1]);
}

function getCanonicalHref(html) {
  const match = html.match(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );
  return match ? match[1] : null;
}

function resolveCanonicalUrl(href) {
  // Canonical tags may be absolute (https://www.muslim.center/x.html) or
  // site-relative (/x.html). Normalize both to a full production URL so they
  // can be compared against the page's own computed URL.
  if (/^https?:\/\//i.test(href)) return href.replace(/\/+$/, '') || href;
  return `${PRODUCTION_DOMAIN}${href.startsWith('/') ? href : `/${href}`}`;
}

function gitLastModified(relFile) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', relFile],
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    if (!out) return null;
    return out.slice(0, 10); // YYYY-MM-DD
  } catch {
    return null;
  }
}

function collectPages() {
  const pages = new Map(); // urlPath -> { urlPath, lastmod }

  for (const dir of PAGE_DIRS) {
    for (const relFile of listHtmlFiles(dir)) {
      const html = fs.readFileSync(path.join(ROOT, relFile), 'utf8');

      if (getMetaRobotsNoindex(html)) continue;

      const ownUrl = `${PRODUCTION_DOMAIN}${urlPathFor(relFile)}`;
      const canonicalHref = getCanonicalHref(html);

      let finalUrl = ownUrl;
      if (canonicalHref) {
        const canonicalUrl = resolveCanonicalUrl(canonicalHref);
        if (canonicalUrl !== ownUrl) {
          // This page declares its canonical URL lives elsewhere -- skip the
          // duplicate. (The canonical target, if it's a real local page, will
          // be picked up on its own when we scan its file.)
          continue;
        }
      }

      if (pages.has(finalUrl)) continue; // de-dupe, just in case

      pages.set(finalUrl, {
        loc: finalUrl,
        lastmod: gitLastModified(relFile),
      });
    }
  }

  return Array.from(pages.values());
}

function toXml(pages) {
  // Homepage first, then everything else alphabetically for a stable diff.
  const sorted = [...pages].sort((a, b) => {
    if (a.loc === `${PRODUCTION_DOMAIN}/`) return -1;
    if (b.loc === `${PRODUCTION_DOMAIN}/`) return 1;
    return a.loc.localeCompare(b.loc);
  });

  const urls = sorted
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function main() {
  const pages = collectPages();
  const xml = toXml(pages);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  console.log(`sitemap.xml written with ${pages.length} URL(s).`);
}

main();
