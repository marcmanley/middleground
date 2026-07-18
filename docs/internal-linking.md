# Internal Linking

Last reviewed: 2026-07-18

Source of truth: link `href` attributes found in all 25 published HTML files. See [site-map.md](site-map.md) for the full page inventory this document cross-references.

## Current structure

### Main navigation (header)

The header nav (desktop + a duplicate mobile `<nav id="mobileNav">` block) is identical across every page and contains:

| Label | Target | Type |
|---|---|---|
| Learning | `learning.html` | Internal |
| Blog | `blog/index.html` (or `../blog/index.html` from `imam.html`, or `index.html` from inside `/blog/`) | Internal |
| About | `about.html` | Internal |
| Substack | `https://middlegroundmuslimcenter.substack.com/` | External |
| YouTube | `https://www.youtube.com/@MiddleGroundMuslimCenter` | External |
| Donate | `https://donorbox.org/middleground` | External |

**Not in the header nav:** `imam.html` and `contact.html`. Both are one click further away (footer-only) than the other three internal pages.

### Footer links

The footer has three labeled columns, repeated on every page: **"Explore"** (internal page links), **"Jumu'ah"** (service info + WhatsApp link, not page links), and **"Connect"** (contact methods). The finding below is specifically about the **"Explore" column**, not the "Connect" column — worth being precise about, since they're easy to conflate (both relate to "how to reach us").

**"Explore" column** (internal page links):

| Label | Target | Type |
|---|---|---|
| Our Imām | `imam.html` | Internal |
| About Us | `about.html` | Internal |
| Learning | `learning.html` | Internal |
| Blog | `blog/index.html` | Internal |
| Podcast | `https://www.imammarc.com/podcast` | External |
| Contact | `contact.html` | Internal — **inconsistently present, see Problems below** |

**"Connect" column** (contact methods — present identically on every page, not part of this finding):

| Label | Target | Type |
|---|---|---|
| Email | `mailto:contact@muslim.center` | External (mailto) |
| Phone | `tel:+19094519770` | External (tel) |

**"Jumu'ah" column:** service-time text plus a WhatsApp link (`https://chat.whatsapp.com/...`), and (on `index.html`/`about.html`) a Google Maps iframe embed — not a text link.

**The gap described below is specifically: the "Contact" entry inside the "Explore" column — a link to the `contact.html` page (the contact *form*) — is missing from most pages' Explore column.** The "Connect" column's email link is unrelated and is present everywhere; that's not the finding.

### Contextual links within page content

- `blog/index.html` links to all 19 posts (verified — every post filename appears as an `href` in the blog index).
- `blog/readinglist.html` and `blog/readinglist-articles.html` link to each other.
- `imam.html` embeds a Google Maps iframe (not a text link).
- The homepage (`index.html`) links out to a small number of specific posts as "featured" teasers: `dreaming-of-a-prophetic-life.html`, `from-villain-to-vindicated.html`, `hope-and-faith-in-times-of-absurdity.html`, `on-morality-and-secularism.html`.
- Individual blog posts do **not** appear to cross-link to other individual posts on the same topic (e.g., `islam-is-not-a-culture.html` does not link to `modernist-muslims.html` even though both concern similar themes — see [content-clusters.md](content-clusters.md)). This was spot-checked on several posts; a full audit of every post's body copy was not performed line-by-line for every file.

### Breadcrumbs

**None found.** No page in the repository contains breadcrumb markup or a visible breadcrumb trail (`grep` for "breadcrumb" across all HTML returned no matches).

## Problems found

### Broken internal link

| Page | Broken link | What it should be | Where |
|---|---|---|---|
| `imam.html` | `href="../blog/index.html"` | `href="blog/index.html"` | Desktop nav, mobile nav, and footer list — 3 occurrences in the same file (lines 105, 121, 284) |

`imam.html` lives at the project root, so the `../` prefix walks one directory above the site root. In production this resolves to a non-existent path and will 404. This is a **critical** finding — see [seo-roadmap.md](seo-roadmap.md). No other page has this bug; every other root-level page correctly omits `../` when linking to `blog/index.html`.

### Pages with very few inbound internal links

| Page | Inbound internal links found | Where from |
|---|---|---|
| `contact.html` | **2** | Footer of `index.html` and `learning.html` only |

This was the most significant finding in this audit. The footer template that appears on all 25 pages is **not actually identical** — the "Contact" footer link is present on `index.html`, `learning.html`, and `contact.html` itself, but **absent from `about.html`, `imam.html`, `blog/index.html`, and all 19 blog posts** (22 of 25 pages). Verified by grepping the `<footer>` block of every file for `contact.html`. This means a visitor reading any blog post — the majority of the site's pages — has no footer path to the contact page; they'd need to go back to the homepage or the Learning page first.

By contrast, `imam.html` ("Our Imām") is linked from the footer of all 25 pages, so it does not have this problem despite being footer-only in the nav.

### Redirecting internal links

None. No internal link in the repository points at a URL that is known to redirect (see [redirects.md](redirects.md) — the site currently has no redirects configured at all).

### Inconsistent anchor text

Checked the two footer-only pages specifically, since they're the ones most likely to accumulate inconsistent phrasing over time:

- `imam.html` is always linked as **"Our Imām"** — consistent across all 25 pages (matches the project's own documented convention in `CLAUDE.md`).
- `contact.html` is always linked as **"Contact"** on the 3 pages that link to it — consistent, just infrequent.

No inconsistent anchor-text variants were found for any other internal target (nav and footer markup is templated/copy-pasted per page rather than generated, so wording matches everywhere it's present).

### Excessive or repetitive links

Nothing rises to the level of a problem. The Donorbox donate link appears twice on most pages (desktop nav + mobile nav — two DOM copies of the same nav, only one visible at a time per viewport) and three times on `index.html` (nav ×2 + a dedicated on-page donate section) — this is normal for a persistent nav CTA plus a homepage feature, not link spam.

### Orphan pages

None — see [site-map.md](site-map.md#orphan-pages) for the full check.

## Recommended internal-linking plan

**Labeled as a recommendation — no links were changed as part of this task.**

1. **Fix the broken `imam.html` → Blog link** (`../blog/index.html` → `blog/index.html`). This is a bug fix, not a linking-strategy change.
2. **Add "Contact" to the shared footer** on `about.html`, `imam.html`, `blog/index.html`, and all 19 posts, so it matches the footer already used on `index.html`/`learning.html`/`contact.html`. This single template fix would give `contact.html` the same inbound-link count as every other page (25, instead of 2).
3. **Add contextual cross-links between thematically related posts**, using actual existing pages (see [content-clusters.md](content-clusters.md) for the full topic grouping):
   - `islam-is-not-a-culture.html` ↔ `modernist-muslims.html` ↔ `performative-islam.html` (all concern tradition vs. modern reinterpretation of Islamic practice).
   - `on-liberalism-modern-age-winter-2020.html` ↔ `on-morality-and-secularism.html` ↔ `race-and-secularism-in-america.html` (all concern secularism/liberalism).
   - `blog/readinglist.html` ↔ `blog/readinglist-articles.html` (already cross-linked — keep as-is).
4. **Consider linking `imam.html` and `contact.html` from the header nav**, not just the footer, if the site wants to reduce click-depth to those two pages to match the other three internal nav items. This is a UX/IA judgment call, not a defect.

## What I could not determine

- Whether the missing footer "Contact" link on 22 pages is an intentional design decision or an unintentional omission. Checked `about.html`'s full git history (every commit that ever touched the file) and it has never had a Contact link in its footer — so this isn't a recent regression from a specific edit, it's a longstanding inconsistency between pages. There is no shared/componentized footer file in this project (each page carries its own copy of the footer markup), so there's no single source to diff against to determine intent.
