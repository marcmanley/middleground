# Middle Ground — Production Readiness Audit

**muslim.center**

A comprehensive, code-level review across architecture, required files, HTML standards, accessibility, SEO, performance, mobile, security, analytics, branding, content, and operations. Audit only – nothing in this repository was modified.

**Audited:** 2026-07-18  
**Pages:** 25 published pages  
**Tech:** Static HTML, Vercel-hosted  
**Live at:** production

This repository already contains an excellent self-audit. The `/docs` folder (dated the same day as this review) contains a rigorous, independently-produced architecture and SEO audit – site-map, internal linking, content clusters, schema, robots, sitemap, redirects, and an SEO roadmap. This report does not duplicate that work. Instead: every claim from `/docs` used below was re-verified against the live files during this pass (a few were already fixed since `/docs` was written – noted where that happened), and this report's real contribution is the ground `/docs` doesn't cover – accessibility, security headers, performance internals, required platform files, HTML validation detail, and operational tooling.

---

## Contents

01 Site Architecture  
02 Required Pages  
03 HTML  
04 Accessibility  
05 SEO  
06 Performance  
07 Mobile Experience  
08 Security  
09 Analytics  
10 Branding  
11 Content Quality  
12 Operational Excellence  
– Final Summary

---

## Readiness Score

| Category | Score |
|----------|-------|
| Architecture & IA | 92 |
| Required Pages | 45 |
| HTML Standards | 82 |
| Accessibility | 74 |
| SEO | 72 |
| Performance | 52 |
| Mobile | 78 |
| Security | 58 |
| Analytics | 82 |
| Branding | 90 |
| Content Quality | 80 |
| Operational Excellence | 42 |

**Overall: 71 / 100**

---

## 01 Site Architecture

This is the most thoroughly audited dimension of the project already – `docs/site-map.md` and `docs/internal-linking.md` independently found and, in most cases, already fixed the real defects. Verified fresh against the live files during this pass:

### VERIFIED FIXED – Five previously Critical/High findings are already resolved

Confirmed just now, not just trusted from docs: the broken `imam.html` → `./blog/index.html` link now correctly reads `blog/index.html` in all 3 locations; `contact.html` now has exactly one `<h1>`; the footer "Contact" link is present on all 25 pages; a self-referencing `<link rel="canonical">` is present on all 25 pages; the two Arabic posts now correctly declare `lang="ar" dir="rtl"`. No further action needed on any of these.

### MEDIUM – No contextual cross-linking between related blog posts

**Description:** 19 posts sit in one flat, reverse-chronological archive. The 5-post "Islam vs. modern reinterpretation" cluster and the 4-post "secularism/liberalism" cluster never link to each other in-body.

**Why it matters:** A reader who finishes one essay in a cluster has no path to the related ones except returning to the flat archive – weaker topical signal for search engines and a shorter session per visitor.

**Risk if ignored:** Missed engagement opportunity; not a launch blocker, but a persistent, compounding content-discovery gap.

**Effort:** Medium (manual placement, ~9 posts)

**CLAUDE.md:** "New posts on an existing theme must link to at least one related existing post in-body."

### MEDIUM – Duplicate URLs still serve 200, canonical tags only hint around it

**Description:** Confirmed live in `docs/redirects.md`: `/` vs `/index.html`, `/about.html` vs `/about.html`, and the three `/blog/` variants all return identical 200 content. Canonical tags now exist, but they're a hint, not an enforcement.

**Why it matters:** Some tools and crawlers still index both forms despite the canonical hint, diluting link signals.

**Risk if ignored:** Minor, ongoing SEO dilution rather than a hard failure.

**Effort:** Low-Medium (one `vercel.json` redirect rule)  
**CLAUDE.md:** No – infra config, not an authoring rule

### LOW – 13 of 19 posts share one migration timestamp

**Description:** Confirmed – `<time datetime="2024-02-29T13:41">` appears on 13 different posts, almost certainly a bulk-import artifact rather than each post's true publish date.

**Why it matters:** Cosmetic today; becomes a factual-accuracy problem the moment `BlogPosting` schema is added (see SEO), since publishing 13 identical `datePublished` values asserts something implausible.

**Risk if ignored:** Blocks a clean structured-data rollout later; low standalone risk now.

**Effort:** Depends whether real dates are recoverable

**CLAUDE.md:** "Never reuse a batch-import timestamp for a new post's `<time datetime>`."

### LOW – Reading-list pages live under `/blog/` despite being reference pages, not essays

**Description:** `blog/readinglist.html` and `blog/readinglist-articles.html` are curated lists, not dated posts, but share the `/blog/` URL pattern.

**Why it matters:** Minor IA clarity issue only; doesn't affect indexing or function.

**Risk if ignored:** None at current scale (2 pages).

**Effort:** N/A – no action needed at this scale  
**CLAUDE.md:** No

---

## 02 Required Pages

The one category this project's own `/docs` barely touches. Direct inspection found more gaps than the single "no favicon" note in the SEO roadmap.

### HIGH – No favicon or icon package anywhere

**Description:** Zero `favicon.ico`, PNG icons, or `<link rel="icon">` tags across all 25 pages – confirmed by direct search.

**Why it matters:** Every browser tab, bookmark, and "Add to Home Screen" action falls back to a blank/generic icon on a site that already has a real logo asset (`brand_assets/`) ready to generate one from.

**Risk if ignored:** Visible, permanent first-impression gap in every tab and bookmark list.

**Effort:** Low  
**CLAUDE.md:** "Every page's `<head>` must include the favicon link block."

### MEDIUM – No web app manifest or apple-touch-icon

**Description:** No `manifest.webmanifest` and no `apple-touch-icon` link anywhere.

**Why it matters:** Without these, "Add to Home Screen" on iOS/Android falls back to a screenshot thumbnail instead of the logo, with no registered app name or theme color.

**Risk if ignored:** Matters specifically to the subset of visitors who bookmark the site to a phone home screen – plausible for a congregation checking Jumu'ah times regularly.

### MEDIUM – No custom 404 page

**Description:** No `404.html` anywhere in the project; Vercel serves its own generic platform error page for any dead or mistyped URL.

**Why it matters:** Keeps a lost visitor inside the site's own branding/nav instead of dropping them onto an unbranded platform page – especially relevant since a prior dormant site's URLs may still be linked externally (per `docs/redirects.md`).

**Risk if ignored:** Visitors hitting old links or typos bounce off-brand with no path back in.

**Effort:** Low (one static page reusing the existing header/footer)  
**CLAUDE.md:** "The site must always maintain a branded 404.html."

### LOW – No security.txt

**Description:** No `/.well-known/security.txt` (RFC 9116) – the standard place for a security researcher to find a responsible-disclosure contact.

**Why it matters:** Low real-world exposure for a static site with no login or user data, but near-zero cost given the org already publishes a contact email.

**Risk if ignored:** Negligible given this site's actual risk profile.

**Effort:** Low  
**CLAUDE.md:** No – one-time file, not a per-page rule

### OPTIONAL – No RSS feed for the blog; no humans.txt

**Description:** No `/rss.xml` for the 19 blog posts (the org's podcast has its own feed via Substack, but the blog doesn't). `humans.txt` is genuinely optional and low-value for this site.

**Why it matters:** Some readers/aggregators prefer RSS; low expected demand for this specific audience, and it would be cheap to generate from the same file-scan approach `generate-sitemap.js` already uses.

**Effort:** Low-Medium  
**CLAUDE.md:** No

---

## 03 HTML

Based on the project's own W3C Nu HTML Checker report (`docs/code-validation-vnu-26.7.16.md`) plus direct re-inspection of the current files. The project already has a hard, working rule against obsolete iframe attributes (`frameborder`) – several findings below are the same class of problem, just not yet caught by that rule's current wording.

### MEDIUM – Google Maps iframes use `width="100%"` – invalid attribute value

**Description:** 3 occurrences (`imam.html:284`, `about.html:265`, `index.html:701`) set the iframe's HTML `width` attribute to a percentage string. Per spec, `width` on `<iframe>` must be a plain integer; the project's own validator report already flags this exact line.

**Why it matters:** Same category of problem as the `frameborder` rule already fixed sitewide – an obsolete/non-conforming attribute pattern, just on a different attribute.

**Risk if ignored:** Fails HTML validation; the accompanying `style="border:0;display:block;"` and wrapper classes largely paper over the visual effect in modern browsers today, but the markup itself doesn't parse per spec.

**Effort:** Trivial – remove the attribute; sizing is already handled by CSS/the wrapper  
**CLAUDE.md:** "Never set iframe width/height as a percentage HTML attribute – size iframes via CSS or the wrapping container" (extends the existing frameborder rule).

### LOW – 3 `<section>` elements with no heading

**Description:** The validator flags 3 sections in `index.html` with no `h2`–`h6` inside – invalid per spec unless it's a plain `<div>`.

**Why it matters:** Weakens the page's heading/landmark outline for screen-reader users who navigate by heading.

**Risk if ignored:** Minor semantic/a11y gap; not visually noticeable.

**Effort:** Low (add an `sr-only h2` or swap to `<div>` per section's intent)  
**CLAUDE.md:** No – case-by-case markup decision

### LOW – `mask` / `-webkit-mask` shorthand flagged by CSS validator

**Description:** `index.html:121-123` uses a well-known border-radius-punch masking technique the Nu checker's CSS grammar reports as "too few values."

**Why it matters:** This specific pattern is a widely-used technique that renders correctly in evergreen browsers – very likely a validator false positive on multi-layer mask shorthand, not a live bug.

**Risk if ignored:** Low; recommend a visual spot-check rather than a rewrite.

**Effort:** Low (verify visually; only rewrite if something actually misrenders)  
**CLAUDE.md:** No

### NOISE, NOT A DEFECT – 17 `@property` CSS "errors" – validator limitation, not a bug

**Description:** The Nu checker's bundled CSS validator doesn't recognize `@property` (CSS Houdini, a real, shipped standard). These are generated internally by the Tailwind CDN build's own gradient/ring custom-property registrations, not hand-authored code in this project.

**Why it matters:** Nothing to fix – noting this so a future pass doesn't mistake it for a real defect. It disappears on its own if Tailwind is ever migrated off the CDN build (see Performance).

**Effort:** N/A  
**CLAUDE.md:** No

### CONFIRMED GOOD – `frameborder` is fully removed sitewide

Grepped all 25 pages – zero occurrences remain, matching the project's own existing CLAUDE.md hard rule. No action needed.

---

## 04 Accessibility

Genuinely strong foundation: `focus-visible` states are defined and used, `prefers-reduced-motion` is respected in 25 places, form fields use correctly-implemented `sr-only` labels, and – checked across all 154 `<img>` tags on the site – not one is missing an `alt` attribute; decorative images are correctly marked `alt="" aria-hidden="true"`. The gaps below are real, but they sit on top of a solid base, not a broken one.

### HIGH – No skip-to-content link anywhere

**Description:** Zero pages include a "Skip to main content" link. Every page repeats the same substantial header + nav block before any unique content.

**Why it matters:** WCAG 2.4.1 (Bypass Blocks, Level A). Keyboard and screen-reader users must tab or navigate through the full nav on every single page load – on the 19 blog posts, that means re-traversing the same header every time just to reach the article.

**Risk if ignored:** Real, ongoing friction for keyboard/assistive-technology users; a Level-A WCAG failure, the baseline most accessibility standards start from.

**Effort:** Low (one hidden-until-focused link + one `id="main"` target, ~25 files, mechanical)  
**CLAUDE.md:** "Every page must include a skip-to-content link as the first focusable element."

### MEDIUM – No width/height attributes on any of 154 images

**Description:** Confirmed – 0 of 154 `<img>` elements specify intrinsic dimensions; sizing is entirely CSS-class-driven (`w-full h-full object-cover`, etc.).

**Why it matters:** Without size hints, the browser can't reserve layout space before an image loads – the direct cause of layout shift as images pop in, and one of the three Core Web Vitals (Cumulative Layout Shift).

**Risk if ignored:** Visibly janky loads on slower connections; a measurable Core Web Vitals/SEO penalty.

**Effort:** Medium (needs each image's real pixel dimensions, applied per tag)  
**CLAUDE.md:** "Every `<img>` must include explicit width/height attributes matching its source file."

### MEDIUM – Only 25 of 154 images use `loading="lazy"`

**Description:** ~16% lazy-load coverage; the rest load eagerly regardless of position on the page – including the 11-photo mosaic well below the fold on `about.html`.

**Why it matters:** Below-the-fold images compete with bandwidth for above-the-fold content on first load, for no visible benefit.

**Risk if ignored:** Slower perceived load, particularly on mobile – compounds with the missing width/height above.

**Effort:** Low (add the attribute below the fold; leave the first-viewport hero eager)  
**CLAUDE.md:** "Below-the-fold images must use `loading="lazy"`; the first-viewport hero must not."

### MEDIUM – Color contrast not verified against WCAG thresholds

**Description:** Can't be reliably confirmed from source alone – several text treatments sit directly over photographic hero backgrounds with gradient overlays, using Tailwind arbitrary color values.

**Why it matters:** Text-over-photo is one of the most common real-world contrast failures, especially at the thin strokes of a serif display face.

**Risk if ignored:** Unknown until measured – could be fine, could be a real WCAG AA failure. Not safe to assume either way.

**Effort:** Low to check (axe DevTools or Lighthouse contrast audit against the live site)  
**CLAUDE.md:** No – a verification step, not an authoring rule

### LOW – Contact form fields lack autocomplete attributes

**Description:** `contact-name` and `contact-email` have no `autocomplete="name"` / `autocomplete="email"`. (The honeypot field correctly uses `autocomplete="off"` – that part is right.)

**Why it matters:** Browser autofill works less reliably without these hints; WCAG 1.3.5 (Identify Input Purpose, AA) expects them on common fields.

**Risk if ignored:** Minor UX friction on a form the site otherwise wants people to complete.

**Effort:** Trivial (two attributes)  
**CLAUDE.md:** "Name/email/phone fields must include the matching autocomplete value."

---

## 05 SEO

`docs/seo-roadmap.md` already covers this dimension in depth. Condensed here with current-state verification; see that file for full detail on each item.

### HIGH – No Open Graph or Twitter Card metadata anywhere

**Description:** Confirmed – 0 of 25 pages have any `og:*` or `twitter:card` tags.

**Why it matters:** Not a ranking factor, but every page's footer links to a WhatsApp community chat – link previews shared in that exact channel (and anywhere else) are currently unstyled: no image, no custom title/description.

**Risk if ignored:** Every shared link looks unfinished in the exact channels this community actually uses to share content.

**Effort:** Medium (25 pages, mechanical once templated – reuses existing title/description copy)  
**CLAUDE.md:** "Every page must include `og:title`, `og:description`, `og:image`, `og:url`, `og:type`."

### MEDIUM – No structured data (schema.org) anywhere

**Description:** 0 of 25 pages have JSON-LD, microdata, or any schema.org reference. `docs/schema.md` already drafted real, non-fabricated JSON-LD for Organization, PlaceOfWorship, Person, and BlogPosting.

**Why it matters:** Helps search engines resolve entities (the organization, the imam, individual posts) with confidence rather than inferring from prose.

**Risk if ignored:** No rich-result eligibility; not a hard failure, a missed opportunity.

**Effort:** Low for Organization/Person; Medium for BlogPosting across 19 posts (blocked on the timestamp issue above)  
**CLAUDE.md:** "New page types should ship with the matching JSON-LD block from `docs/schema.md`."

### MEDIUM – Bing Webmaster Tools not set up

**Description:** Google Search Console is verified; Bing is not.

**Why it matters:** Lower search share than Google, but Bing Webmaster Tools offers a one-click "Import from Google Search Console" that reuses the already-verified GSC property.

**Risk if ignored:** No visibility into Bing's indexing/crawl behavior.

**Effort:** Low (few minutes, one-time)  
**CLAUDE.md:** No – dashboard action

### LOW – No breadcrumbs anywhere

**Description:** No visible breadcrumb trail on any page, confirmed by repo-wide search.

**Why it matters:** Helps orientation on the 19 blog posts (the site's only pages 2 clicks deep) and is a prerequisite for BreadcrumbList schema.

**Risk if ignored:** Minor – nav/footer already provide a path back up.

**Effort:** Medium (one template, 19 files)  
**CLAUDE.md:** No – presentational pattern, not a hard rule

### LOW – 2 meta descriptions run past ~155–160 characters

**Description:** `blog/onblacklivesmatter.html` (163 chars) and `blog/muslims-and-manhood-...html` (161 chars) exceed the point where Google typically truncates snippets. Every other page is under this threshold.

**Why it matters:** The description still works, it may just be cut off mid-sentence in the search results snippet.

**Risk if ignored:** Cosmetic snippet truncation on 2 of 25 pages.

**Effort:** Trivial (trim ~5–8 characters on 2 files)  
**CLAUDE.md:** "Keep meta descriptions under ~155 characters."

### OPTIONAL – `llms.txt`; pillar/hub page for the largest content cluster

Both already documented in `docs/llms.md` and `docs/content-clusters.md` as explicitly optional/experimental – carried forward here unchanged, not re-litigated.

---

## 06 Performance

### MEDIUM – Tailwind CSS loaded via unminified CDN build on every page

**Description:** Every page loads the full, unminified Tailwind utility library from `cdn.tailwindcss.com` – a documented, deliberate choice in the project's own CLAUDE.md, not an oversight.

**Why it matters:** Page speed is a Core Web Vitals ranking factor; the CDN build is render-blocking and ships far more CSS than any single page uses.

**Risk if ignored:** Slower first paint than a compiled/purged build would give – but changing this means overriding an existing documented convention, not fixing an oversight.

**Effort:** High (touches every page's styling approach)  
**CLAUDE.md:** Already a documented convention – flag as a deliberate tradeoff to revisit only if page speed becomes a stated priority, not a silent fix.

### MEDIUM – No modern image formats – site is 100% JPG/PNG

**Description:** Every one of the ~104 images actually referenced by pages (`media/images/web/`) is `.jpg`; zero `.webp` or `.avif` anywhere in the project.

**Why it matters:** WebP/AVIF typically cut image payload 25–50%+ at equivalent visual quality – a real, measurable Largest Contentful Paint win, especially on image-heavy pages like `about.html`'s 11-photo mosaic.

**Risk if ignored:** Heavier page weight than necessary on every image-bearing page.

**Effort:** Medium (batch-convert, ideally via a repeatable step – see Operational Excellence)  
**CLAUDE.md:** "New images should be added as WebP (with a fallback via `<picture>` if needed), not raw JPG/PNG."

### LOW – No explicit caching headers in `vercel.json`

**Description:** `vercel.json` only sets `installCommand` / `buildCommand` / `outputDirectory` – no `headers` block for `Cache-Control` on static assets.

**Why it matters:** Vercel applies reasonable defaults automatically, so this is a smaller gap than on a self-managed server – but an explicit long-lived cache header on `media/` and `brand_assets/` would still improve repeat-visit load time beyond the platform default.

**Risk if ignored:** Minor – the platform default already covers the baseline.

**Effort:** Low (one `headers` block)  
**CLAUDE.md:** No – infra config

### LOW – 87MB of unused raw source images committed to git

**Description:** `media/images/*.png` (root-level, not `/web/`) totals ~87MB the live site never references – it only serves the resized copies in `media/images/web/` (~15MB). `.gitignore` even has a comment block showing this exclusion was intended, then reverted.

**Why it matters:** Doesn't affect the deployed site, but blasts every clone/checkout and any tooling that touches the full working tree.

**Risk if ignored:** Repo grows unbounded as more raw photos are added without the exclusion actually in place.

**Effort:** Low (re-enable the existing `.gitignore` lines going forward)  
**CLAUDE.md:** "Only resized, web-ready images belong in the git-tracked working tree – raw source photos stay outside it."

---

## 07 Mobile Experience

### CONFIRMED GOOD – Viewport meta and mobile nav

A correct viewport meta tag is present on all 25 pages, and the mobile nav (`#mobileNav`) mirrors the desktop header nav 1:1 with no separate mobile-only structure to drift out of sync. No action needed.

### MEDIUM – Touch target sizes not verified live

**Description:** Several icon-only controls (e.g. the `menuToggle` button, styled `p-2 me-2`) render at a size that depends on icon dimensions plus padding – not confirmable from source against the WCAG 2.5.8 (24x24px, AA) or platform (44x44px) guidance without a live measurement.

**Why it matters:** Undersized tap targets are one of the most common real-device mobile UX failures.

**Risk if ignored:** Unknown until measured.

**Effort:** Low to check (DevTools device mode or a real phone); low to fix if undersized  
**CLAUDE.md:** No – verification step

### LOW – No live mobile Core Web Vitals measurement taken

**Description:** This audit is code-only; mobile LCP/CLS/INP are inferred from the code patterns above (unminified Tailwind CDN, no image dimensions, low lazy-load coverage, JPG-only images) rather than measured directly against the live URL.

**Risk if ignored:** The Performance findings above are directionally correct but unquantified until run.

**Effort:** Low (run PageSpeed Insights against the live URL)  
**CLAUDE.md:** No

---

## 08 Security

### MEDIUM – No Content-Security-Policy anywhere

**Description:** Zero CSP directives in any HTML `<meta>` tag or in `vercel.json`'s (nonexistent) headers config.

**Why it matters:** A CSP is defense-in-depth against XSS – it constrains what the several third-party scripts already loaded with no restriction (Tailwind CDN, Google Fonts, Formspree, Vercel Analytics) are allowed to do if any one of them is ever compromised, or if a future change accidentally introduces a script-injection bug.

**Risk if ignored:** No browser-enforced safety net currently exists if a script-injection vulnerability is ever introduced.

**Effort:** Medium (each third-party domain needs an explicit allowance; easy to break the CDN-loaded framework by accident if done carelessly)  
**CLAUDE.md:** No initially – but "new third-party script domains must be added to the CSP allowlist" becomes a rule once a CSP exists.

### LOW – No Referrer-Policy, Permissions-Policy, X-Content-Type-Options, or HSTS headers configured

**Description:** No headers block in `vercel.json` at all. Individual iframes do correctly set `referrerpolicy="strict-origin-when-cross-origin"` per-element – a good existing practice – but there's no site-wide policy layer.

**Why it matters:** Vercel applies some reasonable defaults, but explicit headers are the only way to guarantee a policy rather than depend on defaults that could change.

**Risk if ignored:** Low for this specific site (no login, no sensitive user data), but it's a standard, cheap hardening step.

**Effort:** Low (one headers block)  
**CLAUDE.md:** No – infra config

### CONFIRMED GOOD – External link and iframe hygiene

All 228 `target="_blank"` links correctly include `rel="noopener"` – zero exceptions, no reverse-tabnabbing exposure. Both embedded iframes (YouTube, Google Maps) set `referrerpolicy` and load over HTTPS. The contact form posts over HTTPS with a correctly-implemented, properly-hidden honeypot field. No action needed on any of this.

### LOW – HTTPS enforcement lives entirely outside this repository

**Description:** Per `docs/redirects.md`, `http → https` and apex → `www` canonicalization is real and verified live, but configured in Vercel's dashboard, not in any tracked file.

**Why it matters:** If this project is ever migrated to a different host, this protection silently disappears unless explicitly recreated.

**Risk if ignored:** Only manifests at migration time – already documented in `docs/redirects.md`, which is sufficient.

**Effort:** N/A now – already documented  
**CLAUDE.md:** No

---

## 09 Analytics

### CONFIRMED GOOD – Vercel Web Analytics, Speed Insights, and Search Console

Confirmed present and correctly wired on all 25 pages (`@vercel/speed-insights` is a real dependency in `package.json`, and the analytics snippet is a hard rule in CLAUDE.md). Google Search Console is verified per the site owner. No action needed.

### MEDIUM – Bing Webmaster Tools not set up

(Cross-referenced from SEO – same finding, listed once for completeness in each relevant category.)  
**Effort:** Low  
**CLAUDE.md:** No

### LOW – No monitoring on the one serverless function

**Description:** `api/podcast.js` has a `try/catch` that logs to `console.error` and returns a 502, but nothing alerts the site owner if it starts failing.

**Why it matters:** If the upstream Substack RSS feed changes format or goes down, the homepage podcast player silently breaks with no notification.

**Risk if ignored:** A broken podcast player could go unnoticed for an extended period.

**Effort:** Low (Vercel's own function logs/alerting, or a lightweight monitor)  
**CLAUDE.md:** No

### OPTIONAL – No GA4 or equivalent deeper analytics

Vercel Analytics gives page views and Web Vitals, not acquisition source or funnel detail. Whether that's worth the added complexity/privacy tradeoff is a judgment call, explicitly not a requirement.

---

## 10 Branding

### CONFIRMED GOOD – Logo, footer, and typography consistency

Logo usage, footer structure, and the Cormorant Garamond / Noto Naskh Arabic display pairing are consistent across all 25 pages and follow the project's own documented anti-generic guardrails (custom brand color, non-default shadows and type pairing per CLAUDE.md). The "Our Imam" link-text convention is applied consistently everywhere it appears. No action needed.

### LOW – No written brand style guide beyond raw asset files

**Description:** `brand_assets/` holds an Adobe Color palette JPEG, a logo, and font-list screenshots – but the actual color tokens, font stack, and spacing scale in production only live inside each page's inline Tailwind config.

**Why it matters:** Low risk today since CLAUDE.md already encodes the key rules and the site is visually consistent – but there's no single "here's the palette/type scale" reference outside of reading the code, if a second contributor ever joins.

**Risk if ignored:** Only manifests if/when a second person starts contributing design work.

**Effort:** Low-Medium (one `docs/brand.md` summarizing the actual values already in use)  
**CLAUDE.md:** No – this would be a docs addition, not a rule

---

## 11 Content Quality

### CONFIRMED GOOD – No dead ends, no placeholder content, consistent CTAs

No orphaned, draft, or placeholder/lorem content found anywhere on the site (confirmed by `docs/site-map.md`'s repo-wide search and spot checks during this pass). The Donate CTA appears consistently sitewide. Every page has a clear purpose mapped to the organization's stated mission.

### LOW – `contact.html` is thin even after the `<h1>` fix

**Description:** ~109 words of body copy – the page leans entirely on the form plus address/phone, with no reassurance copy (what happens after submitting, expected response time, etc.).

**Why it matters:** Not broken, just minimal – a small missed opportunity to set expectations for a first-time visitor reaching out.

**Risk if ignored:** Low; purely a copywriting polish item.

**Effort:** Low (copywriting, not code)  
**CLAUDE.md:** No

### LOW – "Islam and science" cluster has only 1 supporting post

**Description:** `blog/islam-and-evolution-did-life-find-a-way.html` is the only post in this topic area.

**Why it matters:** Too thin to be discoverable as a standalone topic if the imam intends to keep covering it.

**Risk if ignored:** None if this was a one-off; only matters if ongoing coverage is intended.

**Effort:** N/A – an editorial/content decision, not a technical one  
**CLAUDE.md:** No

---

## 12 Operational Excellence

### HIGH – No automated tests of any kind

**Description:** `package.json`'s `test` script is a stub (`echo "Error: no test specified" && exit 1`). No HTML validation, link-checking, or visual-regression check runs automatically anywhere.

**Why it matters:** Every fix in this report – and every future page or post – currently depends entirely on manual review to avoid regressions. The `imam.html` broken-link bug this project's own docs found is a live example: it shipped and sat live undetected until a manual audit caught it.

**Risk if ignored:** Future regressions (a broken link, a missing alt attribute, a reintroduced `frameborder`) ship silently, exactly like that one did.

**Effort:** Medium (even a minimal check – the existing Nu HTML Checker plus a link-checker, run on every push – would catch most of this report's HTML-layer findings automatically going forward)  
**CLAUDE.md:** Once CI exists, add "changes must pass the automated HTML/link check before merge."

### HIGH – No CI/CD pipeline with pre-production checks

**Description:** No `.github/workflows` or equivalent anywhere. Deploys happen purely via Vercel's git-push-to-build pipeline, with no gate in between commit and production.

**Why it matters:** Nothing currently stops a broken build, a bad link, or an accessibility regression from reaching production.

**Risk if ignored:** Same class of risk as the missing-tests finding above.

**Effort:** Medium (one GitHub Actions workflow running the build + validator + link-checker)  
**CLAUDE.md:** No – infra, not an authoring rule

### MEDIUM – Image optimization is entirely manual, with no repeatable pipeline

**Description:** `media/images/web/` (the actual served copies) were evidently resized/renamed by hand from the raw originals at some point – no script or build step resizes, compresses, or converts new images automatically.

**Why it matters:** Every future image depends on someone remembering to manually process it into `web/` – exactly the kind of manual step that erodes over time (the raw-source `.gitignore` exclusion above was itself apparently added, then reverted).

**Risk if ignored:** Image weight creeps up as the discipline lapses, directly undermining the Performance findings above.

**Effort:** Medium (a small Node script, similar in spirit to `generate-sitemap.js`, that resizes/converts on demand or at build time)  
**CLAUDE.md:** "New images must be added to `media/images/web/` as resized, web-ready copies – never link a raw source image directly."

### LOW – No linting/formatting config

**Description:** No ESLint/Prettier config anywhere. Low-stakes for a static-HTML project without a JS framework, but the JS that does exist (`generate-sitemap.js`, `api/podcast.js`, `screenshot.mjs`, `serve.mjs`) has no consistency tooling behind it.

**Effort:** Low  
**CLAUDE.md:** No

### LOW – The site's own `/docs` folder has already drifted within the same day

**Description:** Verified directly during this audit: `docs/site-map.md` still listed `contact.html`'s missing `<h1>` and the broken `imam.html` link as open Critical items, but both were already fixed in the repo by the time this audit ran (commit `98444a2`, "Updating the Footer," postdates the docs' own "Last reviewed 2026-07-18" note).

**Why it matters:** A healthy sign fixes are shipping fast – but also a live preview of exactly the drift the docs folder's own README warns against ("update the relevant /docs file in the same change – don't let it drift").

**Risk if ignored:** `/docs` becomes progressively less trustworthy as a reference if this pattern continues.

**Effort:** Low (update the 2–3 already-resolved rows)  
**CLAUDE.md:** No – the docs folder already documents its own maintenance workflow

### CONFIRMED GOOD – Automated sitemap generation

`generate-sitemap.js` → `npm run build` → Vercel `buildCommand` is fully wired and regenerates `sitemap.xml` on every deploy with no manual step. Genuinely good practice, worth naming as a strength rather than just an absence of problems.

---

## Final Summary

### 1. Top 10 highest-priority improvements

1. **Add a skip-to-content link sitewide** – WCAG 2.4.1 Level-A gap, affects every keyboard/screen-reader user on every page load.
2. **Add a favicon and icon package** – Zero icons anywhere; a five-minute fix using an asset that already exists.
3. **Add a branded custom 404 page** – Keeps lost visitors on-brand.
4. **Add Open Graph / Twitter Card metadata sitewide** – Every shared link, including in the site's own WhatsApp community, currently previews unstyled.
5. **Add width/height attributes to all 154 images** – Direct, measurable Cumulative Layout Shift fix.
6. **Add baseline structured data (Organization, Person)** – Low-effort, uses data already published on-site – start here before the full BlogPosting rollout.
7. **Add a security headers block to `vercel.json`** – CSP, Referrer-Policy, Permissions-Policy – currently zero defense-in-depth beyond good link hygiene.
8. **Stand up a minimal CI check (HTML validation + link check)** – The `imam.html` broken-link bug is a live example of exactly what this would have caught automatically.
9. **Fix the 3 invalid `iframe width="100%"` attributes** – Trivial, closes the loop on the validation rule the project already enforces for `frameborder`.
10. **Broaden lazy-loading coverage past the current ~16%** – Below-the-fold images (the `about.html` mosaic especially) compete with real above-the-fold content today.

### 2. Quick wins (under 15 minutes each)

- Remove `width="100%"` from 3 iframes
- Add `autocomplete="name"`/`"email"` to contact form
- Trim 2 over-length meta descriptions
- Add `security.txt`
- Sync 2–3 resolved rows in `/docs`

### 3. Improvements requiring moderate effort

- OG/Twitter Card tags across 25 pages
- Favicon + manifest + apple-touch-icon
- Skip-to-content link across 25 pages
- Image width/height attributes (154 images)
- Custom 404 page
- `vercel.json` security + caching headers
- Contextual cross-links between post clusters

### 4. Long-term improvements

- Migrate off Tailwind CDN to a compiled/purged build
- Automated image pipeline + WebP/AVIF conversion
- CI/CD with validation, link-checking, a11y checks
- BlogPosting schema rollout (post-timestamp-fix)
- Pillar/hub page for the largest content cluster

### 5. Suggested additions to CLAUDE.md

- Every page's `<head>` must include the favicon/icon link block.
- The site must always maintain a branded `404.html`.
- Every page must include a skip-to-content link as the first focusable element.
- Every `<img>` must include explicit width/height attributes matching its source file.
- Below-the-fold images must use `loading="lazy"`; the first-viewport hero must not.
- Name/email/phone form fields must include the matching autocomplete value.
- Extend the existing `frameborder` rule: never set iframe width/height as a percentage HTML attribute – size via CSS.
- Every page must include `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- Keep meta descriptions under ~155 characters.
- New blog posts must link to at least one related existing post in-body, and must never reuse a batch-import `<time datetime>`.
- New images go into `media/images/web/` as resized, web-ready copies only – never link a raw source image directly.

### 6. Production Readiness Score: 71 / 100

The site is **production-viable**, not yet production-hardened – and it's worth being explicit that this is already a live, publicly indexed site (`muslim.center`), not a pre-launch project. Architecture (92), branding (90), and analytics (82) are genuinely strong – the IA is clean, the brand is consistent, and Vercel Analytics/Speed Insights/Search Console are all correctly wired. The score is pulled down by two clusters of real gaps: required platform files and hardening (favicon, manifest, 404 page, CSP/security headers – none of which are hard failures individually, but together they signal a site that hasn't had a dedicated "production hardening" pass) and operational tooling (42 – no automated tests, no CI, no repeatable image pipeline, meaning every future change relies on manual review to avoid the kind of regression the project's own docs already caught once). Performance (52) is held back specifically by missing image dimensions, low lazy-load coverage, and JPG-only images – all concrete, measurable, and fixable without touching the documented Tailwind-CDN convention. None of the findings in this report are launch-blocking in the sense of "the site is broken" – everything renders, functions, and is already indexed – but several (the skip-link, the missing favicon/404, the OG tags) are the kind of gap a visitor or a screen-reader user notices immediately.

### 7. Roadmap

**Note:** the site is already live, so "Before Launch" below is read as "before the next major content/feature push," not a pre-launch gate.

#### PHASE 1 – IMMEDIATE

- Remove `width="100%"` from the 3 Google Maps iframes
- Add `autocomplete` attributes to the contact form
- Trim the 2 over-length meta descriptions
- Add `security.txt`

#### PHASE 2 – BEFORE NEXT PUSH

- Favicon, manifest, apple-touch-icon
- Custom branded 404 page
- Skip-to-content link, sitewide
- Image width/height attributes
- OG/Twitter Card metadata, sitewide
- Baseline structured data (Organization, Person)
- Security headers in `vercel.json`
- Minimum CI check (HTML validation + link check)
- Lazy-load coverage expansion
- Contextual cross-links for blog post clusters
- Sync `/docs` with current state

#### PHASE 3 – SHORT-TERM

- Bing Webmaster Tools setup
- Automated image optimization pipeline
- WebP/AVIF conversion (at least for new images)
- Breadcrumbs
- BlogPosting schema (after timestamp fix)
- Monitoring for `api/podcast.js`

#### PHASE 4 – LONG-TERM

- Migrate off Tailwind CDN to compiled build
- Full CI/CD with a11y checks
- Pillar/hub page for content cluster
- Written brand style guide (`docs/brand.md`)
- Consider GA4 or deeper analytics (optional)