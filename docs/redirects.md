# Redirects

Last reviewed: 2026-07-18

## Existing redirects

**None configured in this repository** — but production (`https://www.muslim.center`) does serve real redirects at the hosting-platform level, outside this codebase. Both are documented below.

### In the repository: none

| Location checked | Result |
|---|---|
| `vercel.json` `redirects` array | Not present — the file only contains `installCommand`, `buildCommand`, `outputDirectory` |
| `_redirects` file (Netlify-style) | Does not exist in this repo |
| `.htaccess` | Does not exist (not applicable — this is a Vercel deployment, not Apache) |
| `netlify.toml` | Does not exist — this project deploys to Vercel, not Netlify |
| `<meta http-equiv="refresh">` in any HTML page | None found across all 25 pages |
| Server-side redirect logic in `api/podcast.js` | The only serverless function in the project; it proxies a Substack RSS feed and returns JSON — it does not issue redirects |
| Git history for renamed or deleted `.html` files | None found — `git log --diff-filter=D` and `--diff-filter=R` across the full history return no `.html` files ever deleted or renamed |

### In production (verified live, 2026-07-18): host/protocol canonicalization

Checked with direct `curl -IL` requests against the live domain. Vercel's domain settings (configured in the Vercel dashboard, not in this repository — this is why a repo-only search above found nothing) enforce a single canonical host:

| Requested URL | Result |
|---|---|
| `http://muslim.center/` | `308` → `https://muslim.center/` → `308` → `https://www.muslim.center/` → `200` |
| `https://muslim.center/` (apex, HTTPS) | `308` → `https://www.muslim.center/` → `200` |
| `http://www.muslim.center/` | `308` → `https://www.muslim.center/` → `200` |
| `https://www.muslim.center/` | `200` (canonical form) |

This is a real, working 2-hop-maximum redirect to a single canonical host+protocol (`https://www.muslim.center`) with no loop. It confirms `https://www.muslim.center` — the domain used throughout this `/docs` folder and in `sitemap.xml`/`robots.txt` — is in fact the one canonical serving URL, and that HTTP and the bare apex domain are not separately indexable dead ends.

**Because this redirect lives in Vercel's dashboard/domain configuration and not in the repository, it won't show up in any future code-only audit of this project** — worth remembering if this project is ever migrated to a different host, since the redirect would need to be recreated there explicitly (e.g., via a `redirects` array in `vercel.json`, or the equivalent on the new platform).

## Legacy URLs from a previous website

A previous website existed at this domain, but per the site owner (2026-07-18): it was dormant for a long time before this rebuild, and this project is being treated as a **ground-up rebuild**, not a migration — there was no intent to preserve the old site's URL structure. Nothing in this repository's history contains any trace of that earlier site (the git history begins with a single "Initial commit: Middle Ground website," `7f37d8e`, already containing the current structure), which is expected under a ground-up rebuild.

**One follow-up worth doing, given this:** if the dormant site had accumulated backlinks or search-index entries under different URLs (e.g., WordPress-style permalinks), those would now 404 with no redirect bridging them. This is a "check, don't assume" item — see the Recommended redirects section below.

## Problems found

### Confirmed duplicate URLs in production (verified live, 2026-07-18)

Unlike the redirect chain above (which resolves to one canonical URL), the following each return **`200` with identical content at two or more URLs**, with no canonical tag anywhere (see [site-map.md](site-map.md)/[schema.md](schema.md)) and no redirect collapsing them into one:

| Duplicate URLs | Status |
|---|---|
| `/` and `/index.html` | Both `200`, identical homepage content |
| `/about.html` and `/about.html/` (trailing slash) | Both `200`, identical content |
| `/blog/index.html`, `/blog/index.html/`, and `/blog/` | All three `200`, identical content |

This pattern (confirmed only spot-checked on `about.html` and the blog index, but Vercel's static-file serving behavior is consistent, so it very likely applies to every `.html` file in the project — i.e., every page probably also answers at its own `/page.html/` trailing-slash variant) is exactly the kind of duplication a self-referencing canonical tag is designed to neutralize. This upgrades the canonical-tag recommendation in [seo-roadmap.md](seo-roadmap.md) from a purely protective, no-evidence-of-duplication measure to one addressing a confirmed, currently-live duplication.

No redirect chains, redirect loops, or broken redirect destinations exist among the host/protocol redirects documented above (verified: maximum 2 hops, always lands on `200`).

## Recommended redirects

**Labeled as a recommendation — nothing was implemented.**

- **Check Google Search Console's "Links" and "Pages" reports** (see [seo-roadmap.md](seo-roadmap.md) item 6 — Search Console is already verified) for any URLs from the old dormant site still showing impressions, or showing as indexed-but-404. If any turn up with meaningful residual backlinks or traffic history, add a targeted 301 redirect from that specific old path to its closest current equivalent, via a `redirects` array in `vercel.json`. Don't do this speculatively — only for URLs Search Console actually shows are still being requested.
- **Address the confirmed trailing-slash/directory duplicate URLs above** — either via a canonical tag on every page (see [seo-roadmap.md](seo-roadmap.md)/[schema.md](schema.md)) pointing at the `.html` form, or by adding `"trailingSlash": false` behavior explicitly / a redirect rule in `vercel.json` that 308s the trailing-slash and directory-style variants to the canonical `.html` URL. A canonical tag is the lower-effort fix; a redirect is the stronger one (it actually collapses the duplicate rather than just hinting which one to prefer).
- **If any current page names ever change** (e.g., a blog post is renamed or a top-level page is restructured per [site-map.md](site-map.md)'s recommendations section), add a 301 redirect from the old path to the new one at the same time, so existing inbound links and search-index entries aren't broken.

## What I could not determine

- The old dormant site's exact URL structure or how much residual search/backlink presence it left — resolvable only via Search Console's historical data (now that the property is verified) or a Wayback Machine lookup, not from this repository.
