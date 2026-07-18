# llms.txt

Last reviewed: 2026-07-18

## Current status

**No `llms.txt` file exists in this repository.** Confirmed by searching the project root and every directory for `llms.txt` or any `llms*.txt` variant — none found.

## Public URL

Not applicable — nothing is served at `https://www.muslim.center/llms.txt` today.

## File contents

Not applicable — there is no file.

## What pages it references

Not applicable.

## How it is maintained

Not applicable.

## What is `llms.txt`, and what would/wouldn't use it

`llms.txt` is a **proposed convention** (not a W3C, IETF, or search-engine standard) for giving AI systems a curated, plain-text summary of a site's key pages — the idea being that a language model reading a page at inference/browsing time gets a shorter, more structured pointer than crawling the full HTML site.

**Important limitations to be explicit about:**

- There is no evidence of universal adoption. Unlike `robots.txt` (which essentially all major crawlers respect) or `sitemap.xml` (which all major search engines consume), `llms.txt` is honored only by whichever specific AI products/crawlers have chosen to look for it — and that set is neither fixed nor guaranteed.
- It is **not a ranking factor** for traditional search engines (Google, Bing) and has no established, verifiable effect on whether an AI system chooses to cite a site.
- Anthropic, OpenAI, Google, and other AI providers have not published a specification requiring or guaranteeing that their models/crawlers read or prioritize `llms.txt`. Whether any given crawler fetches it, and what it does with the contents, is up to that crawler.
- This document does not claim implementing one would produce citations, traffic, or visibility. Any such claim would be unverifiable from this repository (or from any repository).

## Recommended content, if the site chooses to add one

**Labeled as an optional/experimental recommendation — not implemented.** If you decide the (unproven but low-cost) upside is worth it, a minimal `llms.txt` for this site would plainly list the same real pages already in [`sitemap.xml`](../sitemap.xml) — nothing invented:

```
# Middle Ground

> A center for prayer, community, and learning in Upland, CA.

## Main pages
- [About](https://www.muslim.center/about.html): Organization history and mission
- [Our Imām](https://www.muslim.center/imam.html): Biography of Imam Marc Manley
- [Learning](https://www.muslim.center/learning.html): Class schedule (Qur'an, Arabic, youth halaqa, new-Muslim circle)
- [Contact](https://www.muslim.center/contact.html): Contact form, address, phone
- [Blog](https://www.muslim.center/blog/index.html): Reflections and khutbahs by Imam Marc Manley
```

A full page-by-page list of all 19 posts could be added under the Blog entry, mirroring [site-map.md](site-map.md), but the six-line version above is a reasonable minimum if you want to start small.

Because this is a plain static file with no build dependency, it wouldn't need any generation tooling — but if it's added, it should be kept in sync with [sitemap.md](sitemap.md) and [site-map.md](site-map.md) by hand whenever pages are added or removed, since (unlike `sitemap.xml`) there is no generator recommended here for it.

## What I could not determine

- Whether any AI crawler has ever requested `/llms.txt` from this domain (no server logs were available to this task).
