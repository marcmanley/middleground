// Shared helpers for check-links.mjs (internal, blocking) and
// check-links-external.mjs (external, non-blocking).

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

export const ROOT = path.dirname(fileURLToPath(import.meta.url));
export const PORT = 3000;
export const BASE_URL = `http://localhost:${PORT}`;

// Same page discovery as generate-sitemap.js: one *.html file = one route.
const PAGE_DIRS = ['', 'blog'];
export function listPageUrls() {
  const urls = [`${BASE_URL}/`];
  for (const dir of PAGE_DIRS) {
    const abs = path.join(ROOT, dir);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
      if (dir === '' && entry.name === 'index.html') continue; // already added as "/"
      // newsletter-template.html is an HTML email template, not a website
      // page -- it's never linked to or deployed as a route, and its
      // Mailchimp merge tags (*|UNSUB|* etc.) aren't real URLs.
      if (dir === '' && entry.name === 'newsletter-template.html') continue;
      urls.push(`${BASE_URL}/${dir ? `${dir}/` : ''}${entry.name}`);
    }
  }
  return urls;
}

function waitForServer(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  return (async function poll() {
    while (Date.now() < deadline) {
      try {
        const res = await fetch(url);
        if (res.ok) return;
      } catch {
        // server not up yet
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Server at ${url} did not respond within ${timeoutMs}ms`);
  })();
}

async function isServerRunning(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

// Starts serve.mjs (same static server used for local dev, matching
// production MIME types), waits until it responds, runs `fn`, then always
// tears the server down -- even if `fn` throws.
//
// If a server is already listening on PORT (e.g. a developer's own preview
// instance), reuse it instead of spawning a second one -- serve.mjs has no
// error handler for a busy port, so a duplicate spawn would crash loudly,
// and killing it afterward would kill someone else's server out from under
// them.
export async function withServer(fn) {
  if (await isServerRunning(`${BASE_URL}/`)) {
    return await fn();
  }

  const server = spawn('node', ['serve.mjs'], { cwd: ROOT, stdio: 'inherit' });
  try {
    await waitForServer(`${BASE_URL}/`);
    return await fn();
  } finally {
    server.kill();
  }
}
