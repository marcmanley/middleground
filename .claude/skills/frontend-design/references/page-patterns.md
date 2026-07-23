# Reusable Page Patterns

## Primary navigation

1. Learning
2. Blog
3. About
4. Substack
5. YouTube
6. Donate

### Navigation font size

Every page's primary nav must match the site-wide standard set on `index.html`:

- Desktop nav (`<nav class="hidden lg:flex items-center gap-9 ...">`): `text-[19px]`
- Mobile nav (`<nav id="mobileNav" class="hidden lg:hidden pb-6 flex flex-col gap-4 ...">`): `text-[20px]`

Do not use `text-[15px]` or `text-base` for these two nav elements — those were the old, undersized values used on every non-homepage page before 2026-07-23. Every new page must copy the nav markup (including these two classes) from an existing up-to-date page such as `about.html`, not from memory. Before completing any page-creation or navigation task, grep the file for `text-[15px]` or `text-base tracking-wide uppercase` in the nav markup and confirm neither is present.

## Footer

The imam link must read `Our Imām` and point to `imam.html`, with the relative path adjusted for nested pages.

## Analytics

Add exactly once before `</head>`:

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

## Homepage "Check out our Blog!" section

The first card must always be the most recent blog post (by publish date, per `blog/index.html`), in descending date order after that. When a new post is published, update `index.html`'s blog teaser section to match — do not leave it stale.

## Contact form

Preserve the existing design and submit through:

```text
https://formspree.io/f/mojgjnbv
```
