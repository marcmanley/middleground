# SEO Roadmap

Last reviewed: 2026-07-18

This roadmap is built entirely from what was found while auditing the current repository — see [site-map.md](site-map.md), [internal-linking.md](internal-linking.md), [content-clusters.md](content-clusters.md), [schema.md](schema.md), [robots.md](robots.md), [sitemap.md](sitemap.md), [llms.md](llms.md), and [redirects.md](redirects.md) for the full detail behind each item below. **No item in this roadmap guarantees a ranking improvement, traffic increase, or AI citation.** Search and AI-retrieval systems weigh many factors this document has no visibility into (competition, off-site links, user behavior, model-specific retrieval logic). What follows are concrete, verifiable technical/content actions and the specific problem each one addresses — not promises about outcomes.

## Critical

### 1. Broken internal link on `imam.html`

- **Issue:** The Blog link in `imam.html`'s desktop nav, mobile nav, and footer uses `href="../blog/index.html"`. Since `imam.html` is at the project root, `../` escapes the site entirely — the link 404s in production.
- **Why it matters:** This is a real, currently-live broken link on a page that's linked from the footer of all 25 pages. Broken internal links waste crawl budget, break the link-equity path to the blog from this page, and are a bad user experience.
- **Specific action:** Change all 3 occurrences of `href="../blog/index.html"` in `imam.html` to `href="blog/index.html"` (matching every other root-level page).
- **Relevant files:** `imam.html` (lines 105, 121, 284 as of this review)
- **Priority:** Critical
- **Effort:** Trivial (single find-and-replace, 3 occurrences, one file)
- **How to verify:** Load `/imam.html` in a browser and click "Blog" in the header, mobile nav, and footer — each should land on `/blog/index.html`, not a 404.

### 2. `contact.html` has no `<h1>`

- **Issue:** Every other top-level page has exactly one `<h1>`; `contact.html` has zero.
- **Why it matters:** The `<h1>` is one of the strongest on-page relevance signals for both search engines and assistive technology (screen reader users typically navigate by heading). A contact page with no heading structure is weaker for both.
- **Specific action:** Add a single `<h1>` describing the page (e.g., "Contact") to `contact.html`, matching the heading pattern already used on `about.html`, `imam.html`, `learning.html`.
- **Relevant files:** `contact.html`
- **Priority:** Critical
- **Effort:** Trivial
- **How to verify:** `grep -c '<h1' contact.html` returns `1`; confirm visually that the heading renders sensibly in the page layout.

## High priority

### 3. `contact.html` is only reachable from 2 of 25 pages

- **Issue:** The footer's "Contact" link is present on `index.html`, `learning.html`, and `contact.html` itself, but missing from `about.html`, `imam.html`, `blog/index.html`, and all 19 blog posts (22 of 25 pages).
- **Why it matters:** Internal links are how both crawlers and users discover pages and how link equity flows through the site. A page reachable from only 2 of 25 templates is significantly under-linked relative to every other indexable page on the site.
- **Specific action:** Add the "Contact" footer link to the footer of `about.html`, `imam.html`, `blog/index.html`, and all 19 blog posts, matching the footer already used on `index.html`/`learning.html`/`contact.html`.
- **Relevant files:** `about.html`, `imam.html`, `blog/index.html`, all files in `blog/*.html` — see [internal-linking.md](internal-linking.md) for the full list
- **Priority:** High
- **Effort:** Low (one line added to a repeated footer block, ~22 files — mechanical, not exploratory)
- **How to verify:** `grep -L 'contact.html"' *.html blog/*.html` should return no files with a footer (confirm by checking the small number of remaining matches are expected, e.g. `contact.html` linking to itself).

### 4. Two Arabic posts are marked `lang="en" dir="ltr"`

- **Issue:** `blog/embracing-islam-today.html` and `blog/imam-marc-nasab.html` contain Arabic-language titles and body content, but their `<html>` tag reads `lang="en" dir="ltr"`, identical to every English page.
- **Why it matters:** `lang`/`dir` attributes tell both search engines and assistive technology what language and reading direction the content is in. Search engines use `lang` for language-specific indexing/serving; screen readers use it to select the correct pronunciation engine. A mismatch here means both audiences are told the wrong thing about genuinely Arabic content.
- **Specific action:** Update the `<html>` tag on these two pages to `lang="ar" dir="rtl"` (or, if the pages mix English UI chrome with Arabic body content, apply `lang="ar" dir="rtl"` at minimum to the article body wrapper).
- **Relevant files:** `blog/embracing-islam-today.html`, `blog/imam-marc-nasab.html`
- **Priority:** High
- **Effort:** Low, but requires visual review after the change since `dir="rtl"` can affect layout — the project's own `CLAUDE.md` already contains RTL-specific CSS overrides (`[dir="rtl"] .font-display`, `[dir="rtl"] .tracking-wide`), suggesting RTL was anticipated but not applied here yet.
- **How to verify:** `grep -oE '<html[^>]*>'` on both files should show `lang="ar" dir="rtl"`; visually confirm the page still renders correctly.

### 5. No Open Graph or Twitter Card metadata anywhere

- **Issue:** 0 of 25 pages have any `og:*` or `twitter:card` meta tags.
- **Why it matters:** This isn't a traditional search-ranking factor, but it directly affects how every page looks when shared on WhatsApp, Facebook, or X/Twitter — and the site's own footer links to a WhatsApp community chat on every single page, meaning link previews in that exact channel are currently unstyled (no image, no custom title/description — just whatever a client falls back to).
- **Specific action:** Add `og:title`, `og:description`, `og:image`, `og:url`, and `og:type` to each page's `<head>`, using the title/description already present in each page's existing `<title>`/`<meta name="description">` tags (no new copywriting needed) plus a representative image from `media/images/`.
- **Relevant files:** All 25 HTML files — highest-value first: `index.html`, `blog/index.html`, and any individual post likely to be shared (e.g. `blog/hope-and-faith-in-times-of-absurdity.html`, tied to a podcast episode)
- **Priority:** High
- **Effort:** Medium (25 pages, but mechanical once a template is set; requires picking one representative image per page)
- **How to verify:** Paste a page URL into a link-preview debugger (e.g. Facebook's Sharing Debugger or Twitter's Card Validator) once the site is live, or inspect the rendered `<head>` for the new tags.

### 6. Search-engine indexation monitoring — partially set up

- **Status as of 2026-07-18 (per site owner):** Google Search Console is verified. Bing Webmaster Tools is not yet set up. Neither was previously connected — this item is in progress, not untouched.
- **Why it matters:** Without Search Console, there's no way to see how Google actually crawls and indexes the site, catch indexing errors, or confirm the sitemap (see [sitemap.md](sitemap.md)) is being read — visibility that page-view analytics alone can't provide.
- **Specific action — remaining steps in Search Console:**
  1. **Submit the sitemap**, if not already done: Search Console → Sitemaps (left nav) → enter `sitemap.xml` → Submit. Confirm it shows "Success," not "Couldn't fetch."
  2. **Check the property type.** Production redirects both the bare domain (`muslim.center`) and `http://` to `https://www.muslim.center` (verified live — see [redirects.md](redirects.md)), so a **Domain property** (verified via DNS) is the better choice if available, since it aggregates data across `http`/`https` and `www`/non-`www` automatically. A **URL-prefix property** (verified via HTML tag/file) only covers the exact prefix you entered (e.g., only `https://www.muslim.center`) — still correct given the redirects, but won't show you data for the other forms if anyone ever links to them directly.
  3. **Check Pages (formerly "Coverage")** for indexing errors — in particular, watch for old URLs from the previous dormant site (see [redirects.md](redirects.md)) showing up as "Not found (404)." That's expected and not something to fix reactively, but if any of those old URLs also show meaningful impressions/clicks in Performance, that's a signal worth a targeted redirect.
  4. **Use URL Inspection** on the homepage and a couple of key pages (`about.html`, `blog/index.html`) to confirm they're indexed, and request indexing manually if they aren't yet.
  5. **Check Links** (left nav) periodically for external sites linking to the domain — useful both for general SEO awareness and for spotting any links still pointing at pre-rebuild URLs.
- **Bing Webmaster Tools:** lower priority than Google given relative search share, but low-effort once GSC is set up — Bing Webmaster Tools has an "Import from Google Search Console" option that reuses your verified GSC property instead of re-verifying from scratch.
- **Relevant files:** None — this is entirely a console/dashboard action, not a code change.
- **Priority:** High (in progress)
- **Effort:** Low (remaining steps are one-time, a few minutes each)
- **How to verify:** Search Console's Sitemaps tab shows `sitemap.xml` as "Success"; Pages report shows no unexpected errors on the 25 known pages.

## Medium priority

### 7. No canonical tags anywhere — escalated to High, confirmed live duplication

- **Issue:** 0 of 25 pages declare `<link rel="canonical">`.
- **Why it matters:** Originally logged as a protective, Medium-priority measure with no evidence of active duplication. **That evidence now exists:** live `curl` checks against production (2026-07-18) confirm `/` and `/index.html` both serve the identical homepage at `200`, `/about.html` and `/about.html/` (trailing slash) both serve identical content, and `/blog/index.html`, `/blog/index.html/`, and `/blog/` all three serve the identical blog index. This is very likely true of every page on the site (it's a platform-level static-file-serving behavior, not something page-specific), meaning search engines can currently reach the same content through 2–3 different URLs with no signal telling them which one is canonical. Full detail in [redirects.md](redirects.md).
- **Specific action:** Add a self-referencing `<link rel="canonical" href="https://www.muslim.center/...">` to every page, matching its own URL as listed in `sitemap.xml`. This alone won't stop the duplicate URLs from returning `200`, but it tells crawlers which one to index. For a stronger fix that actually collapses the duplicates, see the redirect-based recommendation in [redirects.md](redirects.md).
- **Relevant files:** All 25 HTML files
- **Priority:** High *(escalated from Medium now that duplication is confirmed, not just theoretical)*
- **Effort:** Medium (25 pages, mechanical)
- **How to verify:** Each page's canonical tag matches its own `<loc>` entry in `sitemap.xml`; spot-check that `curl -I` on a page's trailing-slash variant still resolves (canonical tags don't change the `200`, they only tell crawlers which URL to prefer — pair with the redirect fix in [redirects.md](redirects.md) to close the gap fully).

### 8. No structured data (Organization, LocalBusiness, Person, BlogPosting)

- **Issue:** 0 of 25 pages have any JSON-LD, microdata, or `schema.org` markup.
- **Why it matters:** Structured data helps search engines understand entities (the organization, the imam, individual posts) with more confidence than prose alone, and is a prerequisite for many rich-result features. This does not guarantee a rich result will be shown — Google decides that independently — but it removes ambiguity that currently exists.
- **Specific action:** See [schema.md](schema.md) for full recommended JSON-LD examples using only real, already-published data (name, address, phone, post titles/dates). Start with `Organization`/`WebSite` on `index.html` and `ProfilePage`/`Person` on `imam.html` — both are low-effort since the data (name, address, phone) is already on the page.
- **Relevant files:** `index.html`, `imam.html`, `about.html`, `contact.html` (Organization/LocalBusiness); `blog/*.html` (BlogPosting — see caveat below)
- **Priority:** Medium (High for the Organization/Person schema specifically, given how little effort it takes; Medium overall because the BlogPosting rollout depends on item #9 below first)
- **Effort:** Low for Organization/Person; Medium for rolling BlogPosting out to 19 posts
- **How to verify:** Test each page's markup with Google's Rich Results Test after adding it.

### 9. Batch-import timestamp affects 13 of 19 posts

- **Issue:** 13 of the 19 blog posts share the exact same `<time datetime="2024-02-29T13:41">` value — almost certainly a bulk-migration timestamp, not each post's true original publish date.
- **Why it matters:** This is currently just a display-copy quirk (readers see "February 29, 2024" on 13 different posts), but it becomes a factual-accuracy problem the moment `datePublished` structured data is added (see [schema.md](schema.md)) — publishing 13 identical `datePublished` values would assert something implausible.
- **Specific action:** Before adding `BlogPosting` schema sitewide, either source the real original publish date for each of the 13 affected posts (if known to the author) or omit `datePublished` for those posts and only include it for the 6 posts with distinct, plausible dates.
- **Relevant files:** See [schema.md](schema.md) for the exact list of affected vs. unaffected posts
- **Priority:** Medium
- **Effort:** Depends entirely on whether real dates are recoverable (could be trivial if the author remembers, or effectively unresolvable if not)
- **How to verify:** No two posts share an identical `<time datetime>` value unless they were genuinely published simultaneously.

### 10. Render-blocking Tailwind CDN and Google Fonts

- **Issue:** Every page loads the full Tailwind CSS build from a CDN `<script>` tag (`cdn.tailwindcss.com`) and Google Fonts via `<link>`, both of which are documented, deliberate choices in `CLAUDE.md` (the project's own frontend rules) rather than an oversight.
- **Why it matters:** Page speed is a search ranking factor (via Core Web Vitals) and a user-experience factor regardless. The Tailwind CDN build ships the entire utility library uncompiled/unpurged rather than a project-specific minified subset, and both it and the Google Fonts request are render-blocking by default.
- **Specific action:** This is flagged here for completeness, but changing it would mean overriding an explicit, documented project convention (`CLAUDE.md`: "Tailwind CSS via CDN," "Output Defaults"). Any change here should be a deliberate decision by whoever owns that convention, not a side effect of this audit — e.g., migrating to a compiled Tailwind build with `font-display: swap` and preloaded fonts, if and when page-speed becomes a priority.
- **Relevant files:** All 25 HTML files; `CLAUDE.md` (the convention that would need to change first)
- **Priority:** Medium
- **Effort:** High (would touch the styling approach on every page, and requires revisiting a documented project convention)
- **How to verify:** Lighthouse/PageSpeed Insights score improvement on Largest Contentful Paint and Total Blocking Time, if pursued.

### 11. No breadcrumbs

- **Issue:** No page has a visible breadcrumb trail.
- **Why it matters:** Breadcrumbs help users (especially on the 19 blog posts, all one level deep) understand where they are and navigate back up, and are a prerequisite for `BreadcrumbList` structured data (see [schema.md](schema.md), which recommends against adding that schema until a visible breadcrumb exists to match it).
- **Specific action:** Add a simple "Home → Blog → [Post Title]" breadcrumb to each post template.
- **Relevant files:** `blog/*.html` (19 posts)
- **Priority:** Medium
- **Effort:** Medium (one template change, applied to 19 files)
- **How to verify:** Breadcrumb renders visibly on each post and links correctly to `blog/index.html` and `index.html`.

## Low priority

### 12. No favicon

- **Issue:** No `favicon.ico` or `<link rel="icon">` was found anywhere in the project.
- **Why it matters:** Minor — favicons can appear next to search results and browser tabs/bookmarks; their absence is a small polish gap, not a ranking factor.
- **Specific action:** Add a favicon file and a `<link rel="icon">` tag to all pages.
- **Relevant files:** All 25 HTML files (new asset + one tag each)
- **Priority:** Low
- **Effort:** Low
- **How to verify:** Favicon appears in the browser tab when visiting any page.

### 13. `imam.html` and `contact.html` are one click deeper than other internal pages

- **Issue:** The header nav links to Learning, Blog, and About; `imam.html` and `contact.html` are footer-only.
- **Why it matters:** Not a defect — footer links are still crawlable and both pages are indexed (per [site-map.md](site-map.md)) — but it's worth a deliberate decision rather than an accidental one, especially once #3 above (Contact's low inbound-link count) is fixed.
- **Specific action:** Optional: add "Imām" and "Contact" to the header nav if reducing click-depth to those pages is a goal.
- **Relevant files:** All 25 HTML files (shared nav block)
- **Priority:** Low
- **Effort:** Medium (25 files, and a UX/design decision, not just a technical one)
- **How to verify:** N/A — design decision.

### 14. Reading-list pages nested under `/blog/`

- **Issue:** `blog/readinglist.html` and `blog/readinglist-articles.html` are reference lists, not dated posts, but live at a `/blog/` URL alongside 17 actual essays/khutbahs.
- **Why it matters:** Minor IA clarity issue — doesn't affect indexation or functionality today.
- **Specific action:** No action needed at current scale (2 pages); reconsider if the reading-list format grows.
- **Relevant files:** `blog/readinglist.html`, `blog/readinglist-articles.html`
- **Priority:** Low
- **Effort:** N/A (no action recommended now)
- **How to verify:** N/A.

### 15. Inconsistent blog slug conventions

- **Issue:** Most post slugs are short essay titles; a few embed source-publication names or are unusually long compound phrases (see [site-map.md](site-map.md) problem #4).
- **Why it matters:** Minor consistency issue; doesn't block indexing or create duplicate content.
- **Specific action:** No retroactive renames recommended (renaming would require redirects — see [redirects.md](redirects.md) — for no clear benefit to existing content). Apply a consistent short-slug convention to new posts going forward.
- **Relevant files:** N/A for existing posts; a convention to apply to future posts
- **Priority:** Low
- **Effort:** N/A
- **How to verify:** N/A.

## Optional / experimental

### 16. `llms.txt`

- **Issue:** No `llms.txt` file exists.
- **Why it matters:** See [llms.md](llms.md) for full context — this is an unproven, non-standardized convention with no confirmed effect on AI citation or search ranking. Listed here as optional/experimental, exactly as the site's own request for this roadmap specified.
- **Specific action:** If desired, add a minimal `llms.txt` listing the site's real top-level pages (draft provided in [llms.md](llms.md)).
- **Relevant files:** New file, project root
- **Priority:** Optional
- **Effort:** Low
- **How to verify:** File is reachable at `/llms.txt`; beyond that, there is no reliable way to verify effect on any AI system's behavior.

### 17. Pillar/hub page for the "Islam vs. modern reinterpretation" cluster

- **Issue:** The site's largest existing topic cluster (5 posts — see [content-clusters.md](content-clusters.md)) has no hub page tying it together.
- **Why it matters:** Topic-cluster/pillar structures are a common content-organization pattern that can make a site's depth on a subject more discoverable to both users and crawlers — this is a structural/UX argument, not a guaranteed ranking mechanism.
- **Specific action:** Build a landing section (could be as simple as a filtered view within `blog/index.html`, or a new hub page) linking the 5 existing posts identified in [content-clusters.md](content-clusters.md).
- **Relevant files:** `blog/index.html` or a new page; the 5 existing posts to be cross-linked
- **Priority:** Optional
- **Effort:** Medium
- **How to verify:** Hub page exists and links to all 5 posts; posts link back to the hub.

### 18. Supplementary analytics (GA4 or similar)

- **Issue:** The only analytics currently on the site is Vercel Web Analytics (confirmed present on all 25 pages).
- **Why it matters:** Vercel Analytics gives page views and basic Web Vitals; it does not provide the acquisition-source, on-site-behavior, or conversion-funnel detail that a tool like GA4 does. Whether that additional detail is worth the added complexity/privacy tradeoff is a judgment call, not a requirement.
- **Specific action:** Optional: add GA4 (or keep Vercel Analytics only) depending on what reporting depth is actually wanted.
- **Relevant files:** All 25 HTML files, if added
- **Priority:** Optional
- **Effort:** Low to add; ongoing effort to actually use the data
- **How to verify:** N/A — depends on chosen tool.

## Measurement and reporting summary

What's already in place and can be reported on today without any further work: Vercel Web Analytics (page views, Web Vitals, on all 25 pages) and the sitemap/robots.txt pair (crawlability signals — see [sitemap.md](sitemap.md), [robots.md](robots.md)). What's missing for a fuller SEO measurement picture: Search Console/Bing Webmaster verification (item #6) is the single highest-leverage gap, since it's the only way to see actual search-index behavior rather than inferring it from the codebase.
