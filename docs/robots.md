# robots.txt

Last reviewed: 2026-07-18

## Current contents

File: [`robots.txt`](../robots.txt) (project root — served statically, no generation step).

```
User-agent: *
Allow: /

Sitemap: https://www.muslim.center/sitemap.xml
```

## Public location

`https://www.muslim.center/robots.txt` — served directly by Vercel from the project root (`outputDirectory: "."` in [`vercel.json`](../vercel.json); no build step rewrites or generates this file).

## Every user-agent rule

| User-agent | Rule | Effect |
|---|---|---|
| `*` (all crawlers, unconditionally) | `Allow: /` | Every path on the site is allowed for every crawler that respects `robots.txt` |

There is exactly one rule block. No crawler — search, AI, or otherwise — is named individually, and nothing is disallowed anywhere.

## Sitemap declarations

One: `Sitemap: https://www.muslim.center/sitemap.xml`, pointing at the file documented in [sitemap.md](sitemap.md).

## Search indexing crawlers vs. model-training crawlers vs. general crawlers

The file does not distinguish between these categories at all — the single `User-agent: *` block applies equally to:

- **Search indexing crawlers** (Googlebot, Bingbot, etc.) — allowed everywhere. This matches the site's goal of being found in search.
- **Model-training / AI crawlers** (e.g., `GPTBot`, `Google-Extended`, `CCBot`, `anthropic-ai`, `ClaudeBot`, `PerplexityBot`) — also allowed everywhere, by default, simply because nothing disallows them. **This is a site-owner policy decision, not a technical default that needs fixing.** Some sites deliberately block these; this site currently does not block any of them, whether intentionally or because the question has never been considered.
- **General/other crawlers** (SEO tools, scrapers, etc.) — also allowed everywhere, same reasoning.

## Are important search or AI crawlers blocked?

No. Nothing is blocked. Every path, for every named or unnamed user-agent, is explicitly `Allow: /`.

## Are private or development paths exposed?

There's nothing to hide from crawlers in the first place: this repository has no admin panel, login, staging path, or draft-content directory (confirmed in [site-map.md](site-map.md) — no such pages exist). The non-page directories (`media/`, `brand_assets/`, `api/`) don't need `Disallow` rules for SEO purposes — `api/podcast.js` is a JSON endpoint with no useful content for a search index to crawl, but it's also not linked from any page as a browsable URL, and disallowing it wouldn't change anything indexing-relevant. `brand_assets/` is in fact deployed and referenced live — every page's header/footer logo (`<img src="brand_assets/Middle Ground final logo square-2.png">`) is served from it — so it should stay crawlable, not be blocked.

## Potential conflicts with hosting, firewall, or bot-protection settings

`vercel.json` contains no firewall, bot-management, or rewrite rules that would interact with `robots.txt` (its only keys are `installCommand`, `buildCommand`, `outputDirectory`). Vercel's account-level settings (Bot Protection / Attack Challenge Mode, or a Web Application Firewall rule) live outside this repository, in the Vercel dashboard, and can't be fully audited from the codebase alone.

**Empirical check performed 2026-07-18:** a plain, non-browser `curl` request to `https://www.muslim.center/` (and to several other pages) returned the real page content directly at `200`, with no CAPTCHA/challenge page and no bot-protection-related response headers. This is a reasonably good sign that no aggressive bot-challenge feature is currently blocking simple automated requests — but it's not fully conclusive, since some bot-protection systems trigger on traffic patterns (request rate, volume, behavioral signals) rather than on every single request, so a single successful `curl` can't rule out a feature that only activates under different conditions.

**To confirm directly, in the Vercel dashboard:** open the project → **Settings** → look for a **Firewall** or **Security** tab (naming varies by Vercel plan tier; Bot Protection/Attack Challenge Mode and custom WAF rules are Pro/Enterprise features and may not appear at all on a Hobby plan, in which case there's nothing to conflict with). If a Firewall tab exists, check whether any rule is toggled on that would challenge or block traffic — if one is enabled and configured aggressively enough to affect Googlebot or other search crawlers, it would work against the fully-open `robots.txt` above, since crawlers that are technically "allowed" by `robots.txt` could still be challenged or blocked before ever reaching the page.

## Recommended changes

**Labeled as recommendations — `robots.txt` was not modified as part of this task.**

- No changes are required for correctness — the current file is valid and does what it says.
- If you want search engines but not AI-training crawlers to access the site, add explicit blocks for the specific bots you care about (only where that's actually your intent — this is a policy choice, not a bug fix):
  ```
  User-agent: GPTBot
  Disallow: /

  User-agent: Google-Extended
  Disallow: /

  User-agent: CCBot
  Disallow: /
  ```
  This would sit alongside, not replace, the existing `User-agent: *` block.
- Confirm in the Vercel dashboard whether any account-level bot protection is active, since that's invisible from this repository and could contradict the permissive `robots.txt` above.

## What I could not determine

- Whether Vercel account-level bot protection or a WAF rule is active. A live empirical check (above) found no evidence of one blocking plain requests, but this is not a substitute for checking the dashboard directly — see the instructions above.
- Whether the current fully-open policy (no bot restrictions at all) was a deliberate choice or simply the default that was never revisited.
