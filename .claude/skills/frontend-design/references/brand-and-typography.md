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
