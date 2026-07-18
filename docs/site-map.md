# Site Map — Information Architecture

Last reviewed: 2026-07-18

Source of truth: the `middleground` repository as it exists on this date (25 published HTML files: 5 top-level pages + `blog/index.html` + 19 posts). See [README.md](README.md) for how this document fits into the rest of `/docs`.

This site is a set of static HTML files (no framework, no router, no CMS). "Routes" below are simply the file paths as served — there is no `cleanUrls`/`trailingSlash` rewriting configured in [`vercel.json`](../vercel.json), so every URL keeps its `.html` extension except the homepage.

## 1. Current site structure

### Hierarchical tree

```
/ (index.html)
├── /about.html
├── /imam.html
├── /learning.html
├── /contact.html
└── /blog/index.html
    ├── /blog/dreaming-of-a-prophetic-life.html
    ├── /blog/embracing-islam-today.html          (Arabic)
    ├── /blog/from-villain-to-vindicated.html
    ├── /blog/guard-your-narrative.html
    ├── /blog/hope-and-faith-in-times-of-absurdity.html
    ├── /blog/imam-marc-nasab.html                (Arabic)
    ├── /blog/islam-and-evolution-did-life-find-a-way.html
    ├── /blog/islam-is-not-a-culture.html
    ├── /blog/islamic-psychology.html
    ├── /blog/meaning-and-terminology-in-the-quran.html
    ├── /blog/modernist-muslims.html
    ├── /blog/muslims-and-manhood-roots-of-a-modern-crisis.html
    ├── /blog/on-liberalism-modern-age-winter-2020.html
    ├── /blog/on-morality-and-secularism.html
    ├── /blog/onblacklivesmatter.html
    ├── /blog/performative-islam.html
    ├── /blog/race-and-secularism-in-america.html
    ├── /blog/readinglist-articles.html
    └── /blog/readinglist.html
```

Non-page assets that are **not** part of the page tree: `api/podcast.js` (a Vercel serverless function, not a rendered page), `media/`, `brand_assets/` (images), `about.md` (a Markdown source note that feeds the copy in `about.html` — it is not itself built or served as a page), and tooling files (`serve.mjs`, `screenshot.mjs`, `generate-sitemap.js`).

### Page inventory

| Page | Title (`<title>`) | Route | Parent | Nav placement | Purpose |
|---|---|---|---|---|---|
| [`index.html`](../index.html) | Middle Ground — Prayer, Community & Learning | `/` | — (root) | Header logo | Homepage: hero, Jumu'ah khutbah video, learning/blog teasers, podcast player, donate |
| [`about.html`](../about.html) | About — Middle Ground | `/about.html` | Home | Header nav | Org history/mission (sourced from `about.md`) |
| [`imam.html`](../imam.html) | Imām Marc Manley — Middle Ground | `/imam.html` | Home | **Footer only** ("Our Imām") | Imam's bio/photos |
| [`learning.html`](../learning.html) | Learning — Middle Ground | `/learning.html` | Home | Header nav | Class schedule (Qur'an, Arabic, youth halaqa, new-Muslim circle) |
| [`contact.html`](../contact.html) | Contact — Middle Ground | `/contact.html` | Home | **Footer only** | Contact form, address, phone |
| [`blog/index.html`](../blog/index.html) | Blog — Middle Ground | `/blog/index.html` | Home | Header nav ("Blog") | Post archive/index |
| `blog/dreaming-of-a-prophetic-life.html` | Dreaming of a Prophetic Life — Middle Ground | `/blog/dreaming-of-a-prophetic-life.html` | Blog | Blog index only | Reflection essay |
| `blog/embracing-islam-today.html` | التحدّيات في اعتناق الإسلام في المعاصر — Middle Ground | `/blog/embracing-islam-today.html` | Blog | Blog index only | Reflection essay (Arabic) |
| `blog/from-villain-to-vindicated.html` | From Villain to Vindicated — Middle Ground | `/blog/from-villain-to-vindicated.html` | Blog | Blog index only | Khutbah transcript |
| `blog/guard-your-narrative.html` | Guard Your Narrative — Middle Ground | `/blog/guard-your-narrative.html` | Blog | Blog index only | Reflection essay |
| `blog/hope-and-faith-in-times-of-absurdity.html` | Hope & Faith in Times of Absurdity — Middle Ground | `/blog/hope-and-faith-in-times-of-absurdity.html` | Blog | Blog index only | Podcast episode (ep. 50) writeup + embedded player |
| `blog/imam-marc-nasab.html` | مارك مانلي — Middle Ground | `/blog/imam-marc-nasab.html` | Blog | Blog index only | Imam's bio (Arabic) |
| `blog/islam-and-evolution-did-life-find-a-way.html` | Islam & Evolution — Middle Ground | `/blog/islam-and-evolution-did-life-find-a-way.html` | Blog | Blog index only | Reflection essay |
| `blog/islam-is-not-a-culture.html` | Why Islam Is Not a Culture — Middle Ground | `/blog/islam-is-not-a-culture.html` | Blog | Blog index only | Reflection essay |
| `blog/islamic-psychology.html` | Islamic Psychology — Middle Ground | `/blog/islamic-psychology.html` | Blog | Blog index only | Reflection essay |
| `blog/meaning-and-terminology-in-the-quran.html` | Meaning & Terminology in the Qur'an — Middle Ground | `/blog/meaning-and-terminology-in-the-quran.html` | Blog | Blog index only | Reflection essay |
| `blog/modernist-muslims.html` | The Modernist Muslim — Middle Ground | `/blog/modernist-muslims.html` | Blog | Blog index only | Reflection essay |
| `blog/muslims-and-manhood-roots-of-a-modern-crisis.html` | Muslims & Manhood — Middle Ground | `/blog/muslims-and-manhood-roots-of-a-modern-crisis.html` | Blog | Blog index only | Reflection essay |
| `blog/on-liberalism-modern-age-winter-2020.html` | On Liberalism — Middle Ground | `/blog/on-liberalism-modern-age-winter-2020.html` | Blog | Blog index only | Reflection essay (excerpt reprint) |
| `blog/on-morality-and-secularism.html` | On Morality and Secularism — Middle Ground | `/blog/on-morality-and-secularism.html` | Blog | Blog index only | Reflection essay |
| `blog/onblacklivesmatter.html` | Black Lives Matter & Systemic Racism — Middle Ground | `/blog/onblacklivesmatter.html` | Blog | Blog index only | Recorded conversation writeup |
| `blog/performative-islam.html` | Performative Islam — Middle Ground | `/blog/performative-islam.html` | Blog | Blog index only | Reflection essay |
| `blog/race-and-secularism-in-america.html` | Race & Secularism in America — Middle Ground | `/blog/race-and-secularism-in-america.html` | Blog | Blog index only | Book-reflection essay |
| `blog/readinglist-articles.html` | Reading List (Articles) — Middle Ground | `/blog/readinglist-articles.html` | Blog | Blog index only | Curated article list |
| `blog/readinglist.html` | Reading List 2023 — Middle Ground | `/blog/readinglist.html` | Blog | Blog index only | Curated book list |

### Indexability / canonical / sitemap / internal-link status

| Page | Indexable (no noindex found) | Canonical tag present | In `sitemap.xml` | Internally linked |
|---|---|---|---|---|
| `/` | Yes | No (assumption: none needed, only one URL represents home) | Yes | Yes (logo on every page) |
| `/about.html` | Yes | No | Yes | Yes (header nav, footer) |
| `/imam.html` | Yes | No | Yes | Yes (footer only) — see broken-link note below |
| `/learning.html` | Yes | No | Yes | Yes (header nav) |
| `/contact.html` | Yes | No | Yes | Yes (footer only) |
| `/blog/index.html` | Yes | No | Yes | Yes (header nav) |
| All 19 blog posts | Yes | No | Yes | Yes (all linked from `blog/index.html`; see [content-clusters.md](content-clusters.md) for cross-linking gaps) |

No page in the repository currently carries a `<meta name="robots">` tag or a `<link rel="canonical">` tag — confirmed by scanning all 25 HTML files. This means indexability is the HTTP-default ("index, follow") everywhere, and there is no canonical signal anywhere on the site. **This is not just a theoretical gap** — live production checks (2026-07-18) confirm real duplicate-serving URLs with no canonical tag distinguishing them; see problem #2 below and [redirects.md](redirects.md) for the full detail.

## 2. Problems found

| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | **Broken internal link.** `imam.html` (a root-level file) links to Blog using `href="../blog/index.html"` in both the desktop nav, mobile nav, and footer. Because `imam.html` is already at the project root, the `../` prefix escapes the site root and points at a non-existent path in production. Every other root-level page correctly uses `href="blog/index.html"` (no `../`). | `imam.html` lines 105, 121, 284 | Critical — see [internal-linking.md](internal-linking.md) |
| 2 | **No canonical tags anywhere, and confirmed live duplicate URLs.** 0 of 25 pages declare `<link rel="canonical">`. Live production checks confirm `/` and `/index.html` both serve identical content at `200`, as do `/about.html` and `/about.html/` (trailing slash), and `/blog/index.html` / `/blog/index.html/` / `/blog/` (all three). This pattern likely applies to every `.html` file, since it comes from Vercel's static-file serving behavior rather than anything page-specific. | grep across all `.html`; `curl -I` against production, 2026-07-18 | Medium-High — see [redirects.md](redirects.md) and [seo-roadmap.md](seo-roadmap.md) |
| 3 | **Reading-list pages nested under `/blog/`.** `blog/readinglist.html` and `blog/readinglist-articles.html` are curated lists, not essays/khutbahs like the rest of the blog. They're both indexable, both in the sitemap, and cross-link each other, but their URL path (`/blog/...`) doesn't match their actual purpose (reference pages, not dated posts). | File inspection, `blog/index.html` listing | Low — an IA/naming observation, not a functional defect |
| 4 | **Inconsistent slug conventions in `/blog/`.** Most slugs are short essay titles (`islam-is-not-a-culture.html`), but `on-liberalism-modern-age-winter-2020.html` embeds a source-publication name and season/year, and `muslims-and-manhood-roots-of-a-modern-crisis.html` is a long compound slug. The two Arabic posts (`embracing-islam-today.html`, `imam-marc-nasab.html`) have English slugs for Arabic content, with no language marker in the URL. | Filename comparison | Low |
| 5 | **`contact.html` has no `<h1>`.** Every other top-level page has exactly one `<h1>`. | `grep -c '<h1'` returned 0 for `contact.html` | Medium — see [seo-roadmap.md](seo-roadmap.md) |
| 6 | **Arabic-language posts are marked `lang="en" dir="ltr"`.** `blog/embracing-islam-today.html` and `blog/imam-marc-nasab.html` contain Arabic-language titles and body copy but the `<html>` tag on both reads `lang="en" dir="ltr"`, same as every English page. | `grep -oE '<html[^>]*>'` on both files | Medium — see [seo-roadmap.md](seo-roadmap.md) |

### Orphan pages

**None found.** Every one of the 25 pages is reachable from at least one internal link (header nav, footer, or the blog index). This was verified by checking inbound `href`s for every file, including the two pages that are footer-only (`imam.html`, `contact.html`) and the two reading-list pages (confirmed linked from `blog/index.html` and from each other).

### Duplicate or near-duplicate pages

No two *different* page files share the same content. The closest thing to near-duplicates is `blog/readinglist.html` (books) and `blog/readinglist-articles.html` (articles) — same author, same curatorial format, cross-linked to each other, but covering different media types. See [content-clusters.md](content-clusters.md) for a recommendation.

Separately — and this is the more significant finding — **the same page is confirmed reachable at multiple URLs in production**: the homepage at both `/` and `/index.html`, and every checked page also at its own trailing-slash variant (e.g. `/about.html/`) and, for the blog index, also at the bare directory path `/blog/`. This is a URL-level duplication issue (one file, several equally-"live" addresses), not a content-authoring one. See problem #2 above and [redirects.md](redirects.md) for the full verified detail.

### Pages buried too deeply

None. The deepest any page sits is one level under `/blog/` (post pages). Nothing requires more than two clicks from the homepage.

### Confusing or inconsistent route names

Covered in finding #4 above.

## 3. Recommended future structure

**Labeled as a recommendation — not implemented.** No structural changes were made to the website as part of this task.

- Fix the broken `../blog/index.html` link in `imam.html` (should be `blog/index.html`) — this is a correction of an existing bug, not a restructure.
- Consider adding `imam.html` and `contact.html` to the header nav (or a secondary nav row) since they're currently one click deeper (footer-only) than `about.html`/`learning.html`/`blog/index.html`. This is a UX judgment call, not a defect — footer links are still crawlable and indexed.
- Consider whether the two reading-list pages belong at `/blog/reading-list/books.html` and `/blog/reading-list/articles.html`, or a merged `/resources.html`, if the site's content grows. Not urgent at current scale (2 pages).
- No change recommended to the two Arabic posts' URLs; the recommended fix is correcting their `lang`/`dir` attributes (a metadata fix, covered in [seo-roadmap.md](seo-roadmap.md)), not moving them.

## What I could not determine

- Whether `imam.html`'s broken blog link has ever been reported as broken by a user in production. It has been present since the file's initial commit (`7f37d8e`), so it is not a recent regression — it has likely been live since `imam.html` was first deployed.
- Whether the site owner intends `about.md` to eventually drive `about.html` via a build step (no such automation exists today — it's a plain content note living alongside the HTML).
