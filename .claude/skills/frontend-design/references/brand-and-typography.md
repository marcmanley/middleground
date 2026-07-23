# Brand and Typography Reference

## Colors

| Token | Hex | Use |
|---|---|---|
| sky | `#418FBF` | blue accents and selection |
| stone | `#DAD8D6` | muted surfaces and borders |
| earth | `#733A19` | dark brown emphasis |
| clay | `#E85610` | primary accent and links |
| ink | `#0D0D0D` | primary text |
| cream | `#FAF7F2` | page background |

## Font stacks

English:

```css
font-family: 'Caslonian', 'Cormorant Garamond', Georgia, serif;
```

Arabic:

```css
font-family: 'Adobe Arabic', 'Noto Naskh Arabic', 'Traditional Arabic', serif;
```

## Font pairing (ratified 2026-07-23, kit updated to 3 families same day)

`font-display` (the serif stack above) stays on `<body>` and governs all long-form reading: headings, article/bio paragraphs, blockquotes. It is deliberately **not** paired with a sans for body copy — that pairing question is resolved by the UI-chrome rule below instead.

The single Adobe Fonts (Typekit) kit below now serves **all three** site font families — Coolvetica (`font-sans`), Adobe Arabic (`font-arabic`), and Caslonian (`font-display`) — so this one `<link>` is sufficient on every page; no separate kit or link is needed to get Caslonian or Adobe Arabic to actually load (the Google Fonts / Georgia / Noto Naskh Arabic entries later in each stack remain fallbacks only, used if the kit fails to load):

```html
<link rel="stylesheet" href="https://use.typekit.net/wzh5rqg.css">
```

```js
fontFamily: {
  display: ['Caslonian', 'Cormorant Garamond', 'Georgia', 'serif'],
  arabic:  ['Adobe Arabic', 'Noto Naskh Arabic', 'Traditional Arabic', 'serif'],
  sans:    ['coolvetica', 'sans-serif']
}
```

The kit serves four faces (roman/italic × 400/700), so `font-sans` combined with existing weight utilities (`font-medium`, `font-bold`, etc.) resolves correctly rather than faking a synthetic bold.

**Scope — Coolvetica is for UI chrome only, never long-form reading text:**

- Primary navigation (desktop `<nav>` and mobile `#mobileNav`)
- Eyebrow/kicker labels, category badges, tags, byline/date meta — in practice, anything already carrying `uppercase` in its class list
- Buttons and CTAs styled with `tracking-wide uppercase` (e.g. `.btn-gradient`, the `bg-clay … rounded-full` donate/subscribe buttons)

Do not apply `font-sans` to headings (H1/H2/H3), article/bio body paragraphs, or blockquotes — those stay in `font-display`. The mechanical rule in practice: if an element's class already includes `uppercase`, add `font-sans`; if it doesn't, leave it in the serif.

This split was chosen over applying Coolvetica to body copy directly because the Typekit kit's weight range (400/700, roman/italic) is built for short, punchy UI text, not multi-paragraph essays — using it at length for khutbahs/blog posts would read as fatiguing at bold weight and lose the site's editorial voice.

## Type scale (ratified 2026-07-23)

One entry per heading role, reused verbatim — do not invent a new size pair for a new page without checking this table first.

| Role | Classes | Used for |
|---|---|---|
| Hero H1 | `text-6xl sm:text-8xl leading-[0.95] tracking-tight` | `index.html` only — the single homepage hero |
| Page H1 | `text-5xl sm:text-7xl leading-[0.98] tracking-tight` | Section pages: `about.html`, `imam.html`, `contact.html` |
| Utility H1 | `text-4xl sm:text-5xl tracking-tight` | `learning.html`, `404.html`, and future utility pages |
| Section H2 | `text-3xl sm:text-4xl tracking-tight` | Every in-page section heading, no exceptions |
| Article H3 | `font-size: 1.5rem` (in `article.css`) | Sub-headings inside blog posts only |
| Eyebrow label | `text-[15px] tracking-widest uppercase` | Every kicker/label above a heading, on any background |
| Body copy | `text-lg leading-relaxed` | Always the Tailwind token — never `text-[18px]` |
| Article body | `21px` / Arabic `25px` (in `article.css`) | Already centralized — see Blog article body-text sizing below |

This table exists because a sitewide audit (2026-07-23) found real drift: six pages had used four different H1 size/leading pairs, `index.html` alone used four different H2 size pairs for the same "section heading" role, and the eyebrow label had three separate size/tracking combinations across pages. None of the existing pages have been retrofitted to this table yet — new and edited pages should conform going forward; a full retrofit is a separate, larger change.

## Blog post drop cap

Standardize on the manually-applied class:

```css
.article-prose .drop-cap::first-letter { font-size: 3.5rem; /* … */ }
```

wrapped around the opening paragraph's first character. Do not use an automatic `.article-prose p:first-of-type::first-letter` selector — it silently attaches to the wrong paragraph if a lede or pull-quote is ever inserted above the true opening line, with no visible error. Every new blog post should include a drop cap; do not ship one with neither mechanism.

## Alignment

- English long-form prose: left-aligned at all breakpoints
- Arabic long-form prose: RTL and right-aligned
- centered text is reserved for intentional headings, labels, and decorative lines

## Blog article body-text sizing

`/media/css/article.css` is the single, sitewide source of truth for blog article body font-size:

```css
.article-prose { font-size: 21px; }
.arabic-article { font-size: 25px !important; }
```

Every blog post (`blog/*.html`) must link this stylesheet in `<head>`, immediately after the favicon `<link>`:

```html
<link rel="stylesheet" href="/media/css/article.css">
```

Rules:

- Never declare `font-size` for `.article-prose` or `.arabic-article` inline in a page's own `<style>` block. That is exactly the duplication this file exists to prevent.
- Never add a competing Tailwind font-size utility (e.g. `text-[22px]`, `text-xl`) to the `.article-prose` or `.arabic-article` wrapper div. It does not change the rendered size — the shared stylesheet always wins — but it misleads future edits into thinking it does.
- Headings, blockquotes, captions, drop-caps, and other elements nested inside `.article-prose` keep their own font-size rules in each page's inline `<style>` block; only the base body `font-size` is centralized.
- To change body size sitewide, edit `/media/css/article.css` once. Never hand-edit the size in individual posts.
