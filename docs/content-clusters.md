# Content Clusters

Last reviewed: 2026-07-18

Source of truth: the 19 posts in `/blog/` plus the 5 top-level pages, read for their stated topic (title, meta description, and — for posts sampled in depth — opening paragraphs). See [site-map.md](site-map.md) for the full page inventory.

**Assumption:** clusters below are grouped by subject matter as described in each page's own `<title>`/meta description, not by a full read of every post's complete body text. Where a grouping is a judgment call rather than an explicit site-declared category (there is no tagging/category system in this project), it's labeled as such.

## Existing content, organized into clusters

The site has no tag/category taxonomy — `blog/index.html` lists all 19 posts in one flat archive, in reverse-chronological order by `<time>` value. The clusters below are inferred from content, not from any structure already in the site.

### Cluster 1 — Islam vs. modern reinterpretation (existing pillar-shaped topic, no declared pillar page)

| Page | Role |
|---|---|
| `blog/islam-is-not-a-culture.html` | Islam must be elevated beyond human/cultural construct |
| `blog/modernist-muslims.html` | Critiques modernist Muslims dismissing scholarly tradition |
| `blog/performative-islam.html` | Practicing vs. performing Islam publicly |
| `blog/islamic-psychology.html` | Whether "Islamic psychology" can reconcile with a secular discipline |
| `blog/meaning-and-terminology-in-the-quran.html` | Warns against redefining Qur'anic terminology |

This is the largest thematic grouping on the site (5 of 19 posts) and the closest thing to an existing pillar topic, but there is no pillar/hub page tying them together — a visitor who reads one has to return to the flat `blog/index.html` archive to find the others. See [internal-linking.md](internal-linking.md) recommendation #3.

### Cluster 2 — Secularism, liberalism, and society

| Page | Role |
|---|---|
| `blog/on-liberalism-modern-age-winter-2020.html` | Liberalism's influence on Muslim education (reprint of a *Modern Age* excerpt) |
| `blog/on-morality-and-secularism.html` | Secularism and moral accountability |
| `blog/race-and-secularism-in-america.html` | Reflection on Vincent Lloyd's *Race and Secularism in America* |
| `blog/onblacklivesmatter.html` | Recorded conversation on BLM and systemic racism |

4 of 19 posts. These four overlap enough in subject (secularism's relationship to morality, race, and politics) that they read as a coherent mini-cluster, though `onblacklivesmatter.html` is a recorded-conversation writeup rather than an original essay like the other three — noted as a format difference, not a reason to exclude it from the grouping.

### Cluster 3 — Reflections and khutbahs on personal/spiritual life

| Page | Role |
|---|---|
| `blog/dreaming-of-a-prophetic-life.html` | Romance vs. fitrah, prophetic living |
| `blog/from-villain-to-vindicated.html` | Khutbah on Sūrah al-Munāfiqūn, truth-telling |
| `blog/guard-your-narrative.html` | Anger and "fighting the matrix" |
| `blog/hope-and-faith-in-times-of-absurdity.html` | Podcast ep. 50 — hope and faith |
| `blog/muslims-and-manhood-roots-of-a-modern-crisis.html` | Masculinity, anti-intellectualism, and Islamic tradition |

5 of 19 posts. The loosest of the three clusters — these share a register (personal reflection / khutbah) more than a single subtopic. `muslims-and-manhood-...` could also be read as an extension of Cluster 1's "modern reinterpretation" theme; it's placed here because its explicit subject (masculinity) doesn't overlap with the other four in Cluster 1.

### Cluster 4 — Islam and science/academia

| Page | Role |
|---|---|
| `blog/islam-and-evolution-did-life-find-a-way.html` | Islam, evolution, and the Yaqeen Institute/Muslim Skeptic debate |

Only 1 post. Too small to call a cluster on its own merits — flagged below as underdeveloped.

### Reference/resource pages (not essays — a distinct content type)

| Page | Role |
|---|---|
| `blog/readinglist.html` | Curated book list |
| `blog/readinglist-articles.html` | Curated article list |

These are living reference lists, not dated reflections, and are already cross-linked to each other. See [site-map.md](site-map.md) for the observation that their `/blog/` URL path doesn't match their non-post format.

### Language-specific content (not a topic cluster — a language variant)

| Page | Role |
|---|---|
| `blog/embracing-islam-today.html` | Arabic-language reflection on embracing Islam |
| `blog/imam-marc-nasab.html` | Arabic-language biography of the imam |

These aren't a "cluster" in the topical sense — they're the site's only Arabic-language content, and (per [site-map.md](site-map.md)) they're marked `lang="en" dir="ltr"` despite being written in Arabic, which is a metadata defect, not a content gap.

### Static pillar-shaped pages (already existing, outside `/blog/`)

| Page | Role |
|---|---|
| `about.html` | Organization history/mission — functions as the "Organization" pillar |
| `imam.html` | Imam biography — functions as the "Person" pillar |
| `learning.html` | Class offerings — functions as the "Programs" pillar |

## Missing subtopics

**Labeled as recommendations — no content was created.**

- Cluster 1 (Islam vs. modern reinterpretation) has no post addressing tradition/scholarly authority (*taqlīd*, the role of the four schools of fiqh, or Islamic epistemology directly) even though several existing posts gesture at it (`modernist-muslims.html` explicitly criticizes dismissing "the scholarly tradition"). A supporting post on that specific subtopic would fit naturally next to the existing five.
- Cluster 4 (Islam and science) has exactly one post. If this is a subject the imam wants to keep covering, it's currently too thin to be discoverable as a topic on its own — either write 1–2 more supporting posts, or don't treat it as a standalone cluster.
- Learning (`learning.html`) describes specific classes (Qur'an memorization, Arabic language, youth halaqa, new-Muslim circle) but none of those class topics currently have a corresponding blog post that could support them via internal linking (e.g., an Arabic-language-learning post linking to the Arabic class, or a new-Muslim-focused post linking to the new-Muslim circle).

## Overlapping pages

- `blog/readinglist.html` and `blog/readinglist-articles.html` overlap in purpose (same curator, same "recommended reading" intent, split only by media type). They're already cross-linked and clearly differentiated by title, so this is a minor/low-priority overlap, not a duplicate-content risk — see [site-map.md](site-map.md) problem #3.
- No other pairs of posts were found to overlap closely enough in subject to compete with each other for the same query intent.

## Weak or underdeveloped clusters

- **Cluster 4 (Islam and science)** — 1 post, as noted above.
- **Arabic-language content** — 2 posts, both foundational (a bio and an introductory reflection), with no ongoing Arabic content pipeline evident. If Arabic-speaking audience reach is a goal, this is underdeveloped; if the two posts were one-off translations, no action is needed. Not enough information in the repo to tell which is the case (see "What I could not determine" below).

## Suggested pillar pages

**Recommendation, not existing content:**

- A **"Foundations: Islam, Culture & Modern Reinterpretation"** hub page (or a simple index/landing section within `blog/index.html`) linking together the 5 posts in Cluster 1. This is the cluster with the most existing supporting content already written — the lowest-effort pillar to stand up because no new essays are required, just an organizing page and cross-links.

## Suggested supporting pages

**Recommendation, not existing content:**

- A post on scholarly authority/*taqlīd* to round out Cluster 1 (see "Missing subtopics" above).
- One more post in the Islam-and-science space if the imam intends Cluster 4 to grow.

## Content that should be merged

None identified. `readinglist.html` and `readinglist-articles.html` are differentiated enough (books vs. articles) that merging would reduce clarity, not improve it — recommend keeping them separate but continuing their existing cross-links.

## Content that may not belong on the site

None identified. Every page found maps clearly to the organization's stated mission (prayer, community, learning — per `about.md`) or to the imam's teaching/writing. No test, placeholder, or off-topic content was found.

## What I could not determine

- Whether the two Arabic-language posts are meant to anchor an ongoing Arabic content track or were one-time translations. There's no editorial calendar, CMS, or content-plan file in the repository to check against.
- The full text of every post was not read end-to-end; cluster groupings above are based on title, meta description, and (for several posts) opening paragraphs, so a post whose subject shifts significantly partway through could be misclassified above. Recommend a human editorial pass to confirm groupings before building a pillar page.
