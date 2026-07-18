# /docs — Middle Ground Site Documentation

Last reviewed: 2026-07-18

This folder is a living record of the Middle Ground website's information architecture, SEO posture, and technical crawlability setup — built by inspecting the actual repository (static HTML, deployed on Vercel at `https://www.muslim.center`, no framework/CMS). It should evolve as the site does; it is not a one-time snapshot to be filed away.

## What's in each document

| Document | Purpose |
|---|---|
| [site-map.md](site-map.md) | The full page inventory: every route, its title, parent, nav placement, purpose, and indexability status. Documents current structure, problems found, and a recommended future structure. |
| [seo-roadmap.md](seo-roadmap.md) | Prioritized action list (Critical → Optional) covering crawlability, metadata, structured data, page speed, accessibility, content quality, and measurement — each item traces back to a specific finding in the other docs. |
| [content-clusters.md](content-clusters.md) | Groups the 19 blog posts into topic clusters, flags thin/overlapping coverage, and separates existing content from proposed content. |
| [internal-linking.md](internal-linking.md) | Maps nav, footer, and in-content links; documents the one broken link and the one significantly under-linked page found on the site. |
| [schema.md](schema.md) | Structured-data audit. Current state: no schema exists anywhere. Documents recommended JSON-LD for existing page types, using only real on-site data. |
| [robots.md](robots.md) | Documents the current `robots.txt` (fully open, one sitemap declaration) and what it does and doesn't address, including AI-crawler policy. |
| [sitemap.md](sitemap.md) | Documents the working, automated `sitemap.xml` generator (`generate-sitemap.js`) — how it scans pages, excludes drafts/noindex/canonical duplicates, and ties into the Vercel build. |
| [llms.md](llms.md) | Documents that no `llms.txt` exists, what the convention actually is (and isn't), and an optional minimal draft if the site chooses to add one. |
| [redirects.md](redirects.md) | Documents that the site currently has zero redirects of any kind, and what to watch for if that ever changes. |

## Which documents are generated from the current site vs. recommendations

| Document | Describes what exists today | Contains recommendations |
|---|---|---|
| site-map.md | Yes (structure, problems found) | Yes (future-structure section, clearly separated) |
| seo-roadmap.md | No — this is the roadmap itself | Yes (entirely recommendations, prioritized) |
| content-clusters.md | Yes (existing post groupings) | Yes (missing subtopics, suggested pillar/supporting pages — clearly labeled) |
| internal-linking.md | Yes (current link structure, problems found) | Yes (recommended linking plan, clearly separated) |
| schema.md | Yes (confirms nothing exists) | Yes (all schema examples are recommendations, explicitly not added to production) |
| robots.md | Yes (current file contents, verbatim) | Yes (small "Recommended changes" section) |
| sitemap.md | Yes — this describes a real, already-working system | Minimal (one open question at the end) |
| llms.md | Yes (confirms nothing exists) | Yes (optional draft, explicitly experimental) |
| redirects.md | Yes (confirms none exist) | Yes (forward-looking guidance only) |

Two documents are almost entirely descriptive of what's already built and working: **sitemap.md** and **robots.md** — both describe systems already implemented in this repository (`generate-sitemap.js`, `robots.txt`), not proposals.

## When each document should be updated

| Document | Update when... |
|---|---|
| site-map.md | Any page is added, removed, renamed, or moved in the nav/footer |
| seo-roadmap.md | An item is completed (mark it done, don't delete the record), or a new issue is found during a future audit |
| content-clusters.md | A new blog post is published, or an existing post's topic focus changes |
| internal-linking.md | Nav or footer templates change, or new cross-links are added between posts |
| schema.md | Structured data is actually added to any page (move it from "recommended" to "current status") |
| robots.md | `robots.txt` is edited |
| sitemap.md | `generate-sitemap.js` logic changes, or the build/deploy process changes |
| llms.md | An `llms.txt` file is added, edited, or removed |
| redirects.md | Any redirect is added anywhere (`vercel.json`, or otherwise) |

## Maintenance workflow

1. When you change something covered by one of these documents (add a page, edit the footer, add schema, etc.), update the relevant `/docs` file in the same change — don't let it drift.
2. Periodically (e.g., quarterly, or before a larger content push), re-run the same checks these documents describe: scan for broken links, re-check `robots.txt`/`sitemap.xml` against the live site, re-count inbound links to any page that seemed under-linked, and revisit [seo-roadmap.md](seo-roadmap.md) to mark items done or add newly-found issues.
3. Update the "Last reviewed" date at the top of any file you touch, and update it here in README.md if you do a full pass across all of them.
4. Keep recommendations and current-state facts visually separate within each file (as they are now) — if a recommendation is implemented, move its description into the "current status" section of the relevant doc rather than leaving it filed under "recommended."

## Last reviewed

**2026-07-18** — initial creation of this documentation set, based on a full inspection of the repository as it existed on that date (25 published HTML pages; sitemap and robots.txt already implemented in a prior pass of the same effort).
