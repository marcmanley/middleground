#!/usr/bin/env node
/*
 * External link checker for the Middle Ground website.
 * NON-BLOCKING -- run with `npm run check:links:external`.
 *
 * Checks every third-party link found on the site (YouTube, Substack,
 * Donorbox, cited articles/PDFs, etc.) and reports failures, but always
 * exits 0. Third-party sites can block bots, rate-limit, or have brief
 * outages unrelated to this repo -- those must never fail a PR. This job
 * exists so real external link rot (a renamed article, a removed PDF) is
 * still visible without making ordinary development flaky.
 *
 * Narrow exceptions (not real HTTP links, so not checked here either):
 *   - mailto: / tel: links
 *   - `/_vercel/...` (Vercel-injected analytics routes, not real files)
 *   - `https://www.muslim.center/...` is rewritten to localhost, same as
 *     the internal check -- self-referential canonical/og:url tags should
 *     be validated against this PR's files, not live production.
 */

import { LinkChecker } from 'linkinator';
import { BASE_URL, listPageUrls, withServer } from './check-links-common.mjs';

async function run() {
  const checker = new LinkChecker();
  checker.on('link', (result) => {
    if (result.state === 'BROKEN') console.log(`[BROKEN] ${result.url}`);
  });

  const result = await checker.check({
    path: listPageUrls(),
    recurse: true,
    linksToSkip: ['/_vercel/'],
    urlRewriteExpressions: [
      { pattern: '^https://(www\\.)?muslim\\.center', replacement: BASE_URL },
    ],
  });

  const broken = result.links.filter(
    (l) => l.state === 'BROKEN' && !l.url.startsWith(BASE_URL) && l.url !== '/'
  );
  console.log(`\nScanned ${result.links.length} links, ${broken.length} external broken.`);
  for (const link of broken) {
    console.log(`  [${link.status ?? 'ERROR'}] ${link.url} (linked from ${link.parent ?? 'unknown'})`);
  }
  if (broken.length > 0) {
    console.log('\nNon-blocking: these are reported but will not fail the build.');
  }
}

await withServer(run);
process.exit(0);
