# Structured Data (Schema.org) Audit

Last reviewed: 2026-07-18. **Implemented: 2026-07-19, corrected: 2026-07-19** — see status update below. The recommendations section further down is now historical context for *why* each type was chosen; the permanent rules going forward live in [CLAUDE.md](../CLAUDE.md#structured-data-schemaorg).

## Current status (2026-07-19, corrected)

**JSON-LD is now live on all 25 public pages except `404.html`.** Every page carries one `<script type="application/ld+json">` block, inserted before the favicon tag. Reusable entities (WebSite, Organization, Mosque, PostalAddress, Person, Blog) are each defined in full exactly once and referenced elsewhere via `{"@id": ...}` — verified programmatically: zero duplicate entity definitions, zero unresolved `@id` references, zero conflicting `@type` declarations.

The Organization entity originally shipped as `ReligiousOrganization`. validator.schema.org flagged this: the type validates as a legal Schema.org type on its own, but is not in the accepted range for the `publisher`/`about`/`worksFor` properties that reference it from every other page, so it surfaced as errors wherever those properties resolved. Corrected to `Organization` on 2026-07-19 — see [CLAUDE.md](../CLAUDE.md#structured-data-schemaorg) for the permanent rule. The same validator run flagged `founder` (index.html, referencing the Person node defined only on `imam.html`) as resolving to an unspecified type, since single-page validation can't see across pages; index.html's `founder` reference now carries a minimal inline `@type`/`name` stub alongside its `@id` to resolve independently, without duplicating the full Person definition.

| Schema type | Pages found on |
|---|---|
| `WebSite` | `index.html` |
| `Organization` | `index.html` (full def); referenced via `@id` elsewhere |
| `Mosque` | `index.html` (full def) |
| `PostalAddress` | `index.html` (full def) |
| `AboutPage` | `about.html` |
| `ProfilePage` + `Person` | `imam.html` |
| `WebPage` | `learning.html` |
| `ContactPage` | `contact.html` |
| `["Blog","CollectionPage"]` | `blog/index.html` |
| `BlogPosting` | all 19 files in `/blog/` (17 essays/khutbahs + 2 reading lists) |
| `BreadcrumbList` | every page above except `index.html` (homepage has no parent to show) |

Not implemented, by design: `Event` (no stable published schedule), `PodcastSeries`/`PodcastEpisode` (podcast player is client-side/RSS-driven, not static content a crawler sees), `FAQPage` (no visible Q&A content), `dateModified` (no page displays a last-updated date), and `datePublished` on the 13 posts sharing the `2024-02-29T13:41` bulk-migration timestamp (not a real per-post date). See CLAUDE.md for the permanent rule.

The original 2026-07-18 recommendations are preserved below for reference on *why* a dedicated organization/location split was chosen — note that the Organization type actually implemented is `Organization` (not `ReligiousOrganization`, corrected 2026-07-19; also not the `LocalBusiness`/`PlaceOfWorship` this section originally proposed before that direction was given).

## Recommended schema types for existing page types

**All labeled as recommendations. Nothing below has been added to production files.** Examples use real content already on the site (name, address, phone, post titles, dates) — no invented data. Where the site doesn't publish a fact precisely enough for a property (e.g., an exact Jumu'ah time), that's called out rather than filled in with a guess.

### 1. `Organization` + `WebSite` — sitewide, on `index.html`

The homepage is the natural place for a single sitewide `Organization`/`WebSite` pair. Real data available: name ("Middle Ground"), address (`870 N Mountain Ave STE 102, Upland, CA 91786`, present on `about.html`, `contact.html`, `imam.html`), phone (`909-451-9770`), email (`contact@muslim.center`), and social profiles already linked in the footer/nav (YouTube, Substack).

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Middle Ground",
  "url": "https://www.muslim.center/",
  "email": "mailto:contact@muslim.center",
  "telephone": "+1-909-451-9770",
  "foundingDate": "2015",
  "logo": "https://www.muslim.center/brand_assets/Middle%20Ground%20final%20logo%20square-2.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "870 N Mountain Ave STE 102",
    "addressLocality": "Upland",
    "addressRegion": "CA",
    "postalCode": "91786",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.youtube.com/@MiddleGroundMuslimCenter",
    "https://middlegroundmuslimcenter.substack.com/"
  ]
}
```

Both `logo` and `foundingDate` are included above and no longer flagged as uncertain: the logo is already live at `brand_assets/Middle Ground final logo square-2.png` (referenced directly by every page's header/footer, e.g. `index.html` line 168), and the site owner confirmed 2015 as the founding year (2014, per `about.html`'s prose, was when the idea/planning phase happened, not the founding itself).

### 2. `LocalBusiness` (or a more specific subtype) — `about.html`, `contact.html`, `imam.html`

These three pages already display the same physical address and phone number in their footers. `LocalBusiness` (schema.org has no dedicated `Mosque` type; `PlaceOfWorship` exists as a `LocalBusiness` subtype and is the closest accurate fit) would let the address/phone be understood as a physical location rather than just organization contact info.

```json
{
  "@context": "https://schema.org",
  "@type": "PlaceOfWorship",
  "name": "Middle Ground",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "870 N Mountain Ave STE 102",
    "addressLocality": "Upland",
    "addressRegion": "CA",
    "postalCode": "91786",
    "addressCountry": "US"
  },
  "telephone": "+1-909-451-9770"
}
```

**Missing/uncertain properties:** `openingHours`/service times — the site states Jumu'ah is "every Friday, year-round" but explicitly says exact daily prayer times are only "shared via WhatsApp," not published on the site. **Do not fabricate a time.** If precise service times are ever published on-page, `openingHoursSpecification` could be added then — not before.

### 3. `Person` + `ProfilePage` — `imam.html`

`imam.html` is a dedicated biography page for one named individual, which is exactly what `ProfilePage` (wrapping a `Person`) is for.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Marc Manley",
    "honorificPrefix": "Imam",
    "jobTitle": "Resident Imam",
    "worksFor": {
      "@type": "Organization",
      "name": "Middle Ground"
    },
    "url": "https://www.muslim.center/imam.html"
  }
}
```

**Missing/uncertain properties:** `sameAs` could include `https://www.imammarc.com/podcast` (already linked from every page's footer) and the imam's Arabic name/kunya (`blog/imam-marc-nasab.html` gives "Abu Zayyan al-Marwani" in Arabic bio content) if you want that represented — not added here since it would need confirmation of correct transliteration/spelling for a structured field.

### 4. `BlogPosting` — the 19 posts in `/blog/`

Each post already has a title, meta description, author (every post's meta description attributes it to "Imam Marc Manley"), and — for most posts — a visible `<time datetime="...">` value that could map to `datePublished`.

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Why Islam Is Not a Culture",
  "description": "On revelation, culture, and why Islam must be elevated beyond human construct, by Imam Marc Manley.",
  "author": {
    "@type": "Person",
    "name": "Marc Manley"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Middle Ground"
  },
  "datePublished": "2014-04-26",
  "mainEntityOfPage": "https://www.muslim.center/blog/islam-is-not-a-culture.html"
}
```

**Important caveat before implementing `datePublished` at scale:** per [sitemap.md](sitemap.md) and [content-clusters.md](content-clusters.md), **13 of the 19 posts share the exact same `<time datetime="2024-02-29T13:41">` value.** This is almost certainly a bulk-import/migration timestamp, not each post's true original publish date (it's implausible that 13 different essays, spanning clearly different subjects, all were published in the same minute). Adding `datePublished` schema using that shared timestamp as-is would assert a fact (13 identical publish dates) that is very likely false. **Recommendation:** either source real per-post publish dates before adding `datePublished` to those 13 posts, or omit `datePublished` for them and include it only for the 6 posts with distinct, plausible dates (`embracing-islam-today.html`, `imam-marc-nasab.html`, `islam-is-not-a-culture.html`, `from-villain-to-vindicated.html`, `hope-and-faith-in-times-of-absurdity.html`, `on-morality-and-secularism.html`).

### 5. `BreadcrumbList` — blog posts

No breadcrumb trail exists anywhere on the site (confirmed in [internal-linking.md](internal-linking.md)), so there's no visible breadcrumb UI for this schema to describe yet. **Recommend adding a visible breadcrumb (Home → Blog → Post Title) to post pages first; only add `BreadcrumbList` schema once it matches something a visitor can actually see** — schema should describe visible content, not add invisible claims about site structure.

### 6. `WebPage` — the four non-blog top-level pages

A generic fallback for `about.html`, `learning.html`, `contact.html`, and `blog/index.html` (as a `CollectionPage`, a `WebPage` subtype, since it's a list of posts):

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "About — Middle Ground",
  "description": "About Middle Ground — a center for prayer, community, and learning.",
  "url": "https://www.muslim.center/about.html"
}
```

## Types considered and not recommended

- **`Event`** — the site describes a recurring Friday Jumu'ah but, as noted under `LocalBusiness` above, doesn't publish an exact time on any page, and `learning.html`'s class schedule is described as changeable ("check the schedule here... for the most up-to-date times") without one canonical page giving each class a fixed day/time in a schema-ready format. Adding `Event` schema without real start times would create markup that doesn't match visible content — not recommended until the schedule is published in a structured, stable way on-page.
- **`VideoObject`** — `index.html` embeds a YouTube khutbah video, but the visible caption only says "this week's Jumu'ah khutbah," with no specific title, date, or duration shown on the page itself. Schema needs to match visible content; a relative label like "this week's" can't accurately back a `VideoObject`'s `uploadDate`. Not recommended unless the video embed gets a real visible title/date.
- **`FAQPage`** — no page on the site currently presents content in a visible question-and-answer format. Not recommended until/unless such content exists (do not add FAQPage schema to content that isn't actually structured as FAQs, even if it would be eligible for a rich result — this is explicitly against Google's structured-data guidelines and this task's own instructions).
- **`PodcastEpisode`/`PodcastSeries`** — the podcast player on `index.html` and `blog/hope-and-faith-in-times-of-absurdity.html` is populated at runtime by a client-side fetch to `/api/podcast` (see `api/podcast.js`), which calls the Substack RSS feed live. Whatever episode is "latest" changes over time and isn't present in the static HTML a crawler sees without executing JavaScript — this makes it a poor candidate for static schema, since the markup would immediately go stale. (These types also weren't in this task's requested type list.)

## Duplicate or conflicting markup

None — there is no markup to conflict, since nothing exists yet.

## Does schema match visible content?

Not applicable today. The recommendations above were written specifically to only describe what's already visible on each page (see the `Event`/`VideoObject`/`FAQPage` exclusions above, which exist precisely because the visible content doesn't yet support those types).

## What I could not determine

- Correct Arabic transliteration for the imam's full name/kunya, for a `sameAs` or `alternateName` property.
