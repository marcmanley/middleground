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