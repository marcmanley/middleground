# Reusable Page Patterns

## Primary navigation

1. Learning
2. Blog
3. About
4. Substack
5. YouTube
6. Donate

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

## Contact form

Preserve the existing design and submit through:

```text
https://formspree.io/f/mojgjnbv
```
