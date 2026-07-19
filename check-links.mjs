#!/usr/bin/env node
/*
 * Internal link/asset/fragment checker for the Middle Ground website.
 * BLOCKING -- run with `npm run check:links`.
 *
 * Checks internal page links, local assets (images/scripts), and fragment
 * identifiers (#anchors) by crawling the site served locally by serve.mjs
 * (matches production MIME types). External third-party links are
 * intentionally out of scope here -- see check-links-external.mjs -- so a
 * flaky or bot-blocking third-party site never fails this check.
 *
 * Two narrow, documented exceptions to "check everything":
 *   - `https://www.muslim.center/...` and `https://muslim.center/...`
 *     (canonical/og:url tags use www; a few in-content links use the bare
 *     apex, which production 308-redirects to www) are both rewritten to
 *     localhost, so those absolute URLs are validated against this PR's own
 *     files instead of live production.
 *   - `/_vercel/...` paths (Vercel Web Analytics/Speed Insights) are skipped
 *     -- Vercel injects these at the edge on the real platform; they don't
 *     exist as files and 404 under any local static server.
 */

import { LinkChecker } from 'linkinator';
import { BASE_URL, listPageUrls, withServer } from './check-links-common.mjs';

// Third-party hosts linked from the site's nav/footer/content. Checking
// these here would make an internal-only, blocking check depend on
// third-party uptime and bot-blocking behavior -- see check-links-external.mjs
// for where these actually get checked (non-blocking).
const EXTERNAL_HOST_SKIPS = [
  'fonts\\.googleapis\\.com',
  'fonts\\.gstatic\\.com',
  'cdn\\.tailwindcss\\.com',
  'youtube\\.com',
  'youtube-nocookie\\.com',
  'youtu\\.be',
  'donorbox\\.org',
  'substack\\.com',
  'whatsapp\\.com',
  'google\\.com/maps',
  'instagram\\.com',
  'facebook\\.com',
  'twitter\\.com',
  'x\\.com',
  'imammarc\\.com',
  'spotify\\.com',
  'apple\\.com',
  'isi\\.org',
  'tafsir\\.net',
  'lamppostedu\\.org',
  'hubspot\\.net',
];

async function run() {
  const checker = new LinkChecker();
  checker.on('link', (result) => {
    if (result.state === 'BROKEN') console.log(`[BROKEN] ${result.url}`);
  });

  const result = await checker.check({
    path: listPageUrls(),
    recurse: true,
    checkFragments: true,
    checkCss: true,
    linksToSkip: [...EXTERNAL_HOST_SKIPS, '/_vercel/'],
    urlRewriteExpressions: [
      { pattern: /^https:\/\/(www\.)?muslim\.center/, replacement: BASE_URL },
    ],
  });

  const broken = result.links.filter((l) => l.state === 'BROKEN');
  console.log(`\nScanned ${result.links.length} links, ${broken.length} broken.`);
  for (const link of broken) {
    console.log(`  [${link.status ?? 'ERROR'}] ${link.url} (linked from ${link.parent ?? 'unknown'})`);
  }
  return result.passed;
}

const passed = await withServer(run);
process.exit(passed ? 0 : 1);
