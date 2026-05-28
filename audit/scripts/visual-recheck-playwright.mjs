/**
 * Post-fix visual recheck via Playwright (real layout + CSS).
 * Run: npx --yes playwright@1.49.1 install chromium && node audit/scripts/visual-recheck-playwright.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SITE = process.env.SITE_ROOT ?? 'http://localhost:3000';

const ROUTES = [
  '/en',
  '/en/about',
  '/en/services',
  '/en/understanding-hospice',
  '/en/hospice-laws',
  '/en/for-families',
  '/en/insurance',
  '/en/faq',
  '/en/contact',
  '/en/referral',
  '/en/privacy',
  '/en/terms',
  '/en/accessibility',
  '/ko',
  '/ko/about',
  '/ko/contact',
  '/ko/referral',
];

const WIDTHS = [320, 375, 568, 768, 1024, 1280];

async function probe(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const root = document.documentElement;
    const overflowX = root.scrollWidth > root.clientWidth + 1;
    const delta = root.scrollWidth - root.clientWidth;
    const overflowNodes = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 1) {
        overflowNodes.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || '').slice(0, 90),
          right: Math.round(r.right),
        });
      }
    });
    let below24 = 0;
    let t24to43 = 0;
    const smallTargets = [];
    document
      .querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]')
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        const min = Math.min(r.width, r.height);
        const text = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50);
        if (text === 'Skip to main content') return;
        if (min < 24) {
          below24++;
          if (smallTargets.length < 8) smallTargets.push({ text, w: Math.round(r.width), h: Math.round(r.height) });
        } else if (min < 44) t24to43++;
      });
    const brokenImages = [...document.querySelectorAll('img')].filter(
      (img) => img.naturalWidth === 0 && img.getAttribute('alt') !== '',
    ).length;
    return { overflowX, delta, overflowNodes: overflowNodes.slice(0, 6), below24, t24to43, smallTargets, brokenImages };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const issues = [];

  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const url = `${SITE}${route}`;
      try {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(300);
        const row = await probe(page);
        const entry = { route, width, url, ...row };
        results.push(entry);

        if (row.overflowX) {
          issues.push({
            severity: 'P0',
            type: 'horizontal_overflow',
            route,
            width,
            delta: row.delta,
            nodes: row.overflowNodes,
          });
        }
        if (row.brokenImages > 0) {
          issues.push({
            severity: 'P1',
            type: 'broken_images',
            route,
            width,
            count: row.brokenImages,
          });
        }
        if (row.below24 > 15) {
          issues.push({
            severity: 'P1',
            type: 'tap_targets_below_24',
            route,
            width,
            count: row.below24,
            samples: row.smallTargets,
          });
        }
        if (row.t24to43 > 25) {
          issues.push({
            severity: 'P2',
            type: 'tap_targets_24_43',
            route,
            width,
            count: row.t24to43,
          });
        }
      } catch (e) {
        const err = { route, width, error: String(e.message || e) };
        results.push(err);
        issues.push({ severity: 'P0', type: 'navigation_error', ...err });
      }
    }
  }

  // Home overflow sweep (EN)
  const sweep = {};
  for (const w of [280, 300, 320, 340, 360]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(`${SITE}/en`, { waitUntil: 'networkidle' });
    const { overflowX, delta } = await probe(page);
    sweep[w] = { overflowX, delta };
    if (overflowX) {
      issues.push({ severity: 'P0', type: 'home_sweep_overflow', route: '/en', width: w, delta });
    }
  }

  await browser.close();

  const overflowCount = results.filter((r) => r.overflowX).length;
  const summary = {
    generatedAt: new Date().toISOString(),
    site: SITE,
    cellsTested: results.length,
    overflowFailures: overflowCount,
    uniqueIssues: issues.length,
    homeOverflowSweep: sweep,
    issues,
    results,
  };

  const outDir = path.join(process.cwd(), 'audit', 'raw');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'visual-recheck.json'), JSON.stringify(summary, null, 2));

  const md = [
    '# Visual Recheck (post-fix)',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Cells tested | ${summary.cellsTested} |`,
    `| Horizontal overflow cells | ${overflowCount} |`,
    `| Issues flagged | ${summary.uniqueIssues} |`,
    '',
    '## Home overflow sweep (/en)',
    '',
    '| Width | Overflow | Delta |',
    '| --- | --- | --- |',
    ...Object.entries(sweep).map(([w, v]) => `| ${w}px | ${v.overflowX ? 'yes' : 'no'} | ${v.delta ?? 0} |`),
    '',
    '## Issues',
    '',
    ...(issues.length
      ? issues.map(
          (i, n) =>
            `${n + 1}. **[${i.severity}]** ${i.type} — \`${i.route}\` @ ${i.width}px${i.delta != null ? ` (Δ${i.delta}px)` : ''}${i.count != null ? ` (${i.count} hits)` : ''}${i.error ? ` — ${i.error}` : ''}`,
        )
      : ['No issues flagged in this pass.']),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outDir, 'visual-recheck.md'), md);

  console.log(md);
  process.exit(issues.some((i) => i.severity === 'P0') ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
