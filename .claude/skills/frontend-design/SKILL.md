---
name: frontend-design
description: Apply the Middle Ground website’s established frontend design, accessibility, responsive-layout, typography, content, analytics, form, media, and testing conventions whenever creating or modifying public HTML, CSS, browser-facing JavaScript, page templates, blog posts, navigation, footers, forms, cards, or other frontend components.
---

# Frontend Design Skill

## Purpose

Use this skill for all frontend work in the Middle Ground website project, including:

- creating or editing HTML pages
- modifying CSS or Tailwind classes
- changing layout, spacing, typography, colors, navigation, forms, cards, footers, images, or media players
- creating blog posts or reusable page types
- making responsive or accessibility changes
- integrating browser-side services such as Vercel Analytics or Formspree
- translating a visual reference into a webpage

Read `CLAUDE.md` before making changes. Follow both `CLAUDE.md` and this skill. If they conflict, stop and report the conflict before editing files.

## Required workflow

1. Inspect the existing page and at least one comparable page.
2. Reuse the established visual language and existing patterns.
3. Preserve existing content unless the user explicitly requests rewriting.
4. Prefer reusable selectors and patterns over page-specific exceptions.
5. Do not duplicate analytics, scripts, navigation, or footer links.
6. Test the affected page on desktop and mobile.
7. Check browser console errors and broken links.
8. Take screenshots from localhost and inspect the result.
9. Report every file changed and summarize the exact changes.

## Required reference files

Before doing frontend work, read these supporting files:

- `references/brand-and-typography.md`
- `references/page-patterns.md`
- `references/testing-checklist.md`

Use:

- `brand-and-typography.md` for colors, fonts, text sizing, and alignment
- `page-patterns.md` for navigation, footer, page structure, analytics, and forms
- `testing-checklist.md` before completing and reporting frontend work

## Project architecture

This is a static HTML website deployed through GitHub and Vercel.

Current characteristics:

- plain HTML pages
- Tailwind CSS loaded by CDN
- page-level `<style>` blocks are common
- browser-facing JavaScript is embedded in pages unless a shared file already exists
- Vercel serverless functions may live in `/api`
- optimized images live in `media/images/web/`
- raw source images may live in `media/images/`

Preserve the current architecture unless the user explicitly requests a refactor.

## Brand system

Use these established colors:

- sky: `#418FBF`
- stone: `#DAD8D6`
- earth: `#733A19`
- clay: `#E85610`
- ink: `#0D0D0D`
- cream: `#FAF7F2`

Do not replace them with default Tailwind blue, indigo, or unrelated palette colors.

Use these font stacks:

- English: Caslonian, then Cormorant Garamond, Georgia, serif
- Arabic: Adobe Arabic, then Noto Naskh Arabic, Traditional Arabic, serif

Preserve the site’s warm editorial character. Avoid generic SaaS styling.

## Typography

### Long-form English text

Long-form English reading text must be left-aligned on desktop and mobile.

Use the established long-form wrappers, including:

- `.article-prose`
- `.bio-copy`
- another existing reusable content wrapper

Do not center body paragraphs on mobile.

Current sizing conventions:

- English blog body text: `21px`, fixed, set once in `/media/css/article.css`
- biography body text: approximately `22.5px`
- Arabic article body text: `25px`, fixed, set once in `/media/css/article.css`

`/media/css/article.css` is the single source of truth for `.article-prose` and `.arabic-article` font-size. Every blog post must link it:

```html
<link rel="stylesheet" href="/media/css/article.css">
```

Never set `font-size` on `.article-prose` or `.arabic-article` inline in a page's own `<style>` block — that recreates the per-page duplication this file replaced. If the body size ever needs to change, edit `/media/css/article.css` once; do not hand-edit individual posts.

Preserve readable line-height.

### Arabic text

Arabic paragraphs must use:

- `dir="rtl"`
- `lang="ar"`
- the Arabic font stack
- right-aligned text through RTL-aware alignment such as `text-start` within an RTL container

Do not force Arabic body text to left alignment.

Decorative Arabic lines may be centered only when clearly intentional.

### Do not enlarge these as body copy

- navigation
- headings
- buttons
- form controls or labels
- captions
- dates and metadata
- breadcrumbs
- card summaries
- footer text
- decorative text
- utility labels

## Navigation

The primary navigation order must be:

1. Learning
2. Blog
3. About
4. Substack
5. YouTube
6. Donate

Use the correct relative path for each page depth.

External links must use:

```html
target="_blank" rel="noopener noreferrer"
```

The active page may use the clay accent and `aria-current="page"`.

### Navigation font size

The site-wide standard nav size (set on `index.html`) is `text-[19px]` for the desktop `<nav>` and `text-[20px]` for the mobile `#mobileNav`. Every new or edited page must use these exact values, copied from an existing up-to-date page, not `text-[15px]`/`text-base`. See `references/page-patterns.md` for the full rule and the required grep check. This is a fixed nav-chrome size, not "enlarging navigation as body copy" (see the Typography section above) — it's a deliberate, uniform UI size across the whole site.

## Footer

The footer Explore link to the imam biography must always:

- display exactly: `Our Imām`
- link to `imam.html`
- adjust the relative path for nested pages, such as `../imam.html` from `blog/`

The About link must point to `about.html`, with the correct relative path.

Do not rename `Our Imām` to `The Imam`, `The Imām`, or another variation.

## Vercel Web Analytics

Every public HTML page must include this code exactly once immediately before `</head>`:

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

Before finishing:

- verify exactly one instance of `/_vercel/insights/script.js`
- do not duplicate the snippet
- expect this script to return 404 on the local server because Vercel serves it in production

## Forms

The main contact form uses Formspree.

Preserve its existing look and feel.

When editing it:

- keep semantic labels
- ensure fields have meaningful `name` attributes
- use `type="email"` for email
- mark required fields appropriately
- preserve accessible success and error messaging
- preserve the `_gotcha` honeypot
- never expose passwords, SMTP credentials, or private API keys
- do not recreate the retired custom contact backend unless explicitly requested

Current Formspree endpoint:

```text
https://formspree.io/f/mojgjnbv
```

## Images

Before adding an image:

1. Inspect the source image.
2. Check its dimensions.
3. Create an optimized web copy in `media/images/web/`.
4. Use a descriptive filename.
5. Add meaningful alt text unless decorative.
6. Choose an intentional crop and object position.
7. Test the crop on desktop and mobile.

Do not reference multi-megabyte raw images when an optimized copy should be used.

Preserve breathing room between image mosaics and adjacent sections.

## Blog posts

New English blog posts should follow the established pattern:

- site header
- Back to Blog link
- category badge when applicable
- title
- byline or subtitle
- author/date row
- optional hero image
- long-form `.article-prose` content
- tags
- author card
- site footer
- mobile-menu script
- Vercel Analytics snippet

Add new posts to the blog index in reverse-chronological order.

Preserve:

- left-aligned English prose on mobile
- established body size
- drop-cap treatment only where already used
- distinct Arabic typography for RTL posts

Do not apply a second drop cap to supplemental paragraphs outside the main article body.

## Podcast components

When reusing the podcast player:

- preserve the established card design
- keep controls readable against artwork
- show the latest episode title when available
- fetch from the existing `/api/podcast` endpoint
- keep the player disabled while loading
- fail gracefully
- remember that `/api/podcast` may not work on the local static server but should work on Vercel

External podcast and media links must open in a new tab with safe rel attributes.

## Interaction and accessibility

Every interactive element must have:

- an appropriate semantic element
- visible hover behavior
- visible `focus-visible` styling
- a meaningful active or selected state when applicable
- keyboard accessibility
- an accessible label when text is not visible

Use the established focus style:

```css
.btn-focus:focus-visible {
  outline: 2px solid #E85610;
  outline-offset: 3px;
}
```

Respect reduced-motion preferences.

Do not use `transition-all`; transition only needed properties.

## Responsive behavior

Use a mobile-first approach.

Test at minimum:

- approximately 390px wide
- approximately 1000–1200px wide

Check:

- body alignment
- text wrapping
- heading scale
- image crops
- card spacing
- navigation
- footer links
- horizontal overflow
- section spacing

## Screenshot and testing workflow

Always serve through localhost, never `file:///`.

For significant visual changes:

1. confirm the localhost server is running
2. load the affected page
3. inspect the browser console
4. take a desktop screenshot
5. take a mobile screenshot
6. compare against the existing design or user reference
7. fix visible inconsistencies
8. repeat until clean

Expected local-only failures may include:

- `/_vercel/insights/script.js`
- Vercel-only `/api` routes on the static development server

Do not treat those expected failures as proof the production implementation is broken.

## Content preservation

Do not silently rewrite user copy.

Allowed without further confirmation:

- explicit typo corrections
- HTML entity cleanup
- punctuation normalization that preserves meaning
- removal of clear paste artifacts
- broken-markup fixes

When removing duplicates or contradictory fragments, explain what was changed.

## One-time edits are not permanent rules

Do not treat these as global conventions unless the user explicitly says they are site-wide or required going forward:

- the location of one homepage section
- the wording of one paragraph
- the image for one post
- a one-time podcast episode
- a one-time spacing or color adjustment

## Final checklist

Before finishing frontend work, verify:

- `CLAUDE.md` was read
- this skill was applied
- brand colors are preserved
- navigation order is correct
- navigation font size matches `index.html` (`text-[19px]` desktop / `text-[20px]` mobile) — grep the page for `text-[15px]` or `text-base tracking-wide uppercase` in the nav markup and confirm neither remains
- footer uses `Our Imām`
- English prose is left-aligned
- Arabic prose is RTL/right-aligned
- analytics appears exactly once
- external links are safe
- optimized images are used
- desktop and mobile were checked
- console errors were reviewed
- no unrelated content was changed
- all changed files are reported
