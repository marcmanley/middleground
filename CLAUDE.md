# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.
- **Hard rule: a `serve.mjs` instance must always be left running on port 3000 at the end of every turn, with no exceptions.** The user relies on `http://localhost:3000` to view the site live; if it's down they can't see anything.
  - Before ending a turn, check `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` (or equivalent) and confirm it returns `200`.
  - If any tooling (tests, `check-links`, one-off verification) started and then killed its own temporary server instance, or if a server was stopped for any reason during the turn, always restart `node serve.mjs` in the background before finishing — do not leave the user without a running server just because the task itself didn't need one left over.
  - `serve.mjs` reads files fresh on every request (no caching), so ordinary file edits never require a restart — only restart when the server process itself is down.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Footer "Explore" Column
- The link to the Imam's bio page must always read **"Our Imām"** and point to `imam.html` (adjust relative path per page depth, e.g. `../imam.html` from `blog/`).

## Vercel Web Analytics
- Every public HTML page must include the following Vercel Analytics code immediately before the closing `</head>` tag:

```html
<script>
  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

## HTML Standards and Validation Rules
- Never introduce obsolete or non-conforming HTML attributes.
- Never use the obsolete `frameborder` attribute on iframe elements. Use CSS or the Tailwind `border-0` utility instead.
- When removing `frameborder` from an existing iframe, preserve all other attributes, behavior, dimensions, URLs, and surrounding layout — remove only that one attribute.
- Never change iframe URLs, dimensions, permissions, titles, loading behavior, referrer policy, or surrounding layout unless explicitly authorized.
- Standards-compliance fixes must always be the smallest possible change.
- Never perform unrelated cleanup, formatting, or restructuring while making validation fixes.
- Before completing HTML work, check that no `frameborder=` attributes (or other obsolete HTML attributes) remain in files created or modified during the task.

## Skip-to-Content Accessibility
- Every public HTML page must include a keyboard-accessible "Skip to main content" link.
- The skip link must be the first focusable element in the document body.
- The link must target the page's primary `<main>` element.
- The primary `<main>` element must have a stable unique ID, preferably `main-content`.
- The skip link must be visually hidden when not focused.
- It must become clearly visible when it receives keyboard focus.
- When visible, it must not shift the page layout.
- It must appear above all other page content and remain readable against the page background.
- Its focused appearance must use the site's existing typography, brand colors, border-radius, and focus treatment.
- It must have a clearly visible focus indicator.
- Activating the link must move keyboard focus to the main content, not merely scroll the page.
- Do not create duplicate skip links or duplicate `main-content` IDs.
- Do not change page layout, header structure, navigation, or design while implementing this requirement.
- Before completing any public-page task, verify that the skip link works using keyboard navigation.

## Favicons and Site Icons
- Every public HTML page must reference the approved site favicon.
- The canonical favicon source for this project is: `media/images/logo-favicon.png`
- Favicon markup must use a root-relative path: `<link rel="icon" type="image/png" href="/media/images/logo-favicon.png">`. Do not use page-relative paths (e.g. `../media/images/logo-favicon.png`) — the site deploys at the domain root, so root-relative paths resolve identically on every page regardless of nesting depth.
- Before adding favicon markup, check whether equivalent favicon markup already exists.
- Do not create duplicate favicon declarations.
- Do not replace, redesign, crop, recolor, or regenerate the approved favicon unless explicitly authorized.
- All newly created public HTML pages must include the favicon declaration in the document `<head>`.
- Because the path is root-relative, moving or nesting a page never requires updating its favicon path.
- Before completing any sitewide HTML task, verify that favicon references are present and valid on all created or modified public pages.

## Image Dimensions (Cumulative Layout Shift)
- Every `<img>` element on a public page must include explicit `width` and `height` attributes set to the image source file's real intrinsic pixel dimensions (e.g. `width="1600" height="1067"`), so the browser can reserve the correct aspect ratio before the image loads.
- Never guess dimensions. Read the actual source file (e.g. with `sips -g pixelWidth -g pixelHeight <file>`) and use its exact intrinsic size.
- `width`/`height` attributes set the image's default aspect ratio only — they do not override sizing set by CSS or Tailwind classes (`w-full`, `h-full`, `object-cover`, etc.). Adding them must never change rendered appearance, cropping, or responsive behavior.
- This applies to every new `<img>` added to any public page, including ones generated dynamically by JavaScript.
- Before completing any task that adds or modifies an `<img>` element, verify it has correct `width` and `height` attributes matching its real source file.

## Open Graph and Twitter Card (Social-Sharing) Metadata
- Every public HTML page must include a complete Open Graph and Twitter Card block in its `<head>`, immediately after the page's `<link rel="canonical">` tag (or immediately after the `<meta name="description">` tag on pages with no canonical, e.g. `404.html`).
- The block must contain, in this order: `og:title`, `og:description`, `og:type`, `og:url` (see 404 exception below), `og:image`, `og:image:alt`, `og:site_name`, then a blank line, then `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
- `og:title` and `twitter:title` must exactly match the page's existing `<title>` content — do not write new title copy.
- `og:description` and `twitter:description` must exactly match the page's existing `<meta name="description">` content — do not write new description copy.
- `og:site_name` is always `Middle Ground`. `twitter:card` is always `summary_large_image`.
- `og:type` is `article` for blog posts (individual essays/khutbahs in `blog/`), and `website` for every other page, including `blog/index.html` and reference-list pages (`blog/readinglist.html`, `blog/readinglist-articles.html`) that are not dated posts.
- `og:url` must be an absolute URL matching the page's own `<link rel="canonical">` value exactly. **Exception:** `404.html` has no canonical (a 404 has no single canonical location) — omit `og:url` entirely on that page rather than inventing one.
- `og:image` and `twitter:image` must be an absolute URL (`https://www.muslim.center/media/images/...`), never a relative path — social-media crawlers do not resolve relative URLs against the page.
- Default sitewide image (use when a page has no dedicated hero/featured image at a usable landscape aspect ratio): `media/images/web/hero-imam.jpg` with alt `Imam Marc Manley`.
- Prefer a page-specific image over the default when the page already has a dedicated hero/featured image at a landscape-ish ratio (roughly 1.5:1 to 2:1). Do not use a portrait-oriented image (taller than wide) as a social-preview image — it crops badly in the ~1.91:1 card shape every platform renders. Fall back to the sitewide default instead.
- `og:image:alt` and `twitter:image:alt` must reuse the image's existing `alt` text from where it already appears on the page, when available, rather than writing new copy.
- Before adding this block, check whether equivalent `og:`/`twitter:` metadata already exists on the page — do not create duplicates.
- Before completing any sitewide HTML task, verify that every public page has exactly one of each required `og:`/`twitter:` tag (except `og:url` on `404.html`), and that every `og:image`/`twitter:image` URL is absolute and points to a file that actually exists.

## Structured Data (Schema.org)
- Every public HTML page (everything except `404.html`) must contain page-appropriate Schema.org JSON-LD in a single `<script type="application/ld+json">` block, inserted immediately before the favicon `<link rel="icon">` tag.
- `404.html` must not carry substantive structured data — it has no canonical URL and describes nothing real.
- Use a single `@context`/`@graph` document per page. Never emit more than one `<script type="application/ld+json">` block on a page.
- **Reusable entities — permanent `@id` values, defined once, referenced everywhere else:**
  - WebSite → `https://www.muslim.center/#website` (fully defined on `index.html` only)
  - Organization → `https://www.muslim.center/#organization`, type `ReligiousOrganization` (fully defined on `index.html` only)
  - Mosque → `https://www.muslim.center/#mosque`, type `Mosque` (fully defined on `index.html` only) — the physical location; reached from the Organization via its `location` property. It is not a second organization.
  - PostalAddress → `https://www.muslim.center/#address` (fully defined on `index.html` only)
  - Person (Imam Marc Manley) → `https://www.muslim.center/imam.html#person` (fully defined on `imam.html` only)
  - Blog collection → `https://www.muslim.center/blog/#blog` (fully defined on `blog/index.html` only)
- On every other page, reference these entities with a bare `{"@id": "..."}` object only — never re-declare their properties. This is how duplicate entities are avoided across 25+ hand-authored pages with no shared templating.
- Page-type mapping (do not deviate without a reason as strong as what justified these):
  - Homepage (`index.html`) → `WebSite` + `ReligiousOrganization` (+ `Mosque`, `PostalAddress` as their supporting nodes)
  - `about.html` → `AboutPage`, `about` → Organization
  - `imam.html` → `ProfilePage` wrapping the full `Person` node
  - `learning.html` → `WebPage` (not `LearningResource` — the page is a class schedule, not itself a standalone instructional resource; only switch to `LearningResource` if a future page genuinely is one)
  - `contact.html` → `ContactPage`, `about` → Organization (whose `address` is the PostalAddress)
  - `blog/index.html` → combined `["Blog", "CollectionPage"]` node
  - Individual blog posts → `BlogPosting`, with `author` → Person, `publisher` → Organization, `isPartOf` → Blog collection
  - A future dedicated donation page → `WebPage`, `about` → Organization (no such page exists today; the donate CTA is a homepage section linking off-site to `donorbox.org`, which needs no schema of its own)
- `BreadcrumbList` — add wherever page hierarchy exists (every page except the homepage), using canonical URLs, as its own node in the same `@graph`. This is invisible JSON-LD only; do not add a visible breadcrumb UI as part of this — that would be a visual/content change, out of scope for a schema task.
- **Never invent:**
  - Dates — `datePublished` may only be added when a page's own `<time datetime="...">` value is a real, distinct publish date. 13 of the 19 blog posts share one identical bulk-migration timestamp (`2024-02-29T13:41`); that is not a real per-post publish date, so `datePublished` must stay omitted on those posts. No page currently shows a "last updated" date anywhere, so `dateModified` stays omitted sitewide until a page actually displays one.
  - Coordinates — the Mosque's `GeoCoordinates` (`34.104841, -117.67083`) came from the Google Place ID already embedded in the site's own footer map iframe (`Middle Ground Mosque`, CID `0x80c331a5cab6cad9:0xab6f18bce8eadfe3`), not a lookup or a guess. Never add or change coordinates without an equally traceable source.
  - Authors, events, podcast metadata, or publication facts not already stated in the page's own visible copy or metadata.
  - `Event` schema for Jumu'ah or classes — the site never publishes a stable, structured schedule (daily prayer times are WhatsApp-only; class times change). Do not add `Event` schema until a page publishes one.
  - `PodcastSeries`/`PodcastEpisode` schema — the homepage/imam-page podcast player is populated client-side from a live RSS feed (`/api/podcast`); "latest episode" isn't stable, static HTML content a crawler sees. Revisit only if a dedicated, server-rendered podcast page is ever built.
- Reuse existing on-page copy for `headline`/`name`/`description`/`image` (title tag, meta description, `og:image`) rather than writing new copy — same rule as the Open Graph block above.
- Before completing any sitewide or new-page HTML task, validate: every JSON-LD block is syntactically valid, every `{"@id": ...}` reference resolves to an entity defined somewhere on the site, no entity is redefined (with full properties) in more than one place, and no page introduces a conflicting `@type` for an existing `@id`.
- Any new page type introduced in the future (event page, podcast page, donation page, etc.) must get an appropriate Schema.org model, following the reuse pattern above, before it is deployed.

## Continuous Integration and Site Validation
- The repository must maintain an automated CI workflow (`.github/workflows/validate-site.yml`) for HTML validation and internal link checking.
- CI must run on pull requests and pushes to the production branch (`main`).
- Every public HTML page must pass validation before deployment.
- All internal page links, fragment identifiers, and local asset references must resolve correctly.
- New pages and renamed files must be reflected in navigation, links, sitemap entries, and related metadata.
- Public files must not be excluded merely to make CI pass.
- Exceptions and ignore rules must be narrow, documented, and technically justified (see the comments in `.htmlvalidate.cjs`, `check-links.mjs`, and `check-links-external.mjs`).
- External-link instability must not compromise the reliability of the primary internal-link check — external links are checked in a separate, non-blocking job (`check:links:external`).
- Existing CI workflows must be updated rather than duplicated.
- The project's existing package manager (npm), build process, and deployment configuration must be preserved.
- Future changes must run `npm run test:site` locally before being considered complete.
- A CI failure must be investigated rather than bypassed or disabled.
- Validation tools and workflow action versions should be reviewed periodically for maintenance and security.
- CI configuration changes must not alter visible site design or content unless separately approved.
- **No public-page change is complete until HTML validation and internal link checking (`npm run test:site`) pass.**

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use obsolete HTML attributes (for example, `frameborder` on iframe elements).
- Every public HTML page must include a working "Skip to main content" link as its first focusable element.
- Every public HTML page must include a valid reference to the approved site favicon.
- Every `<img>` element must include explicit `width` and `height` attributes matching its source file's real intrinsic dimensions — never guessed.
- Every public HTML page must include a complete Open Graph and Twitter Card metadata block, reusing the page's existing title/description and an absolute image URL — never invented copy or relative image paths.
- No public-page change is complete until HTML validation and internal link checking (`npm run test:site`) pass.