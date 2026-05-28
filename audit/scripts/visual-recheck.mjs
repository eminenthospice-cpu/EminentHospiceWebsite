/**
 * Post-fix visual recheck: overflow + undersized tap targets per route × width.
 * Run: node audit/scripts/visual-recheck.mjs
 */
const SITE = process.env.SITE_ROOT ?? 'http://localhost:3000';

const ROUTES = [
  '/en',
  '/en/about',
  '/en/services',
  '/en/contact',
  '/en/referral',
  '/en/faq',
  '/en/insurance',
  '/ko',
  '/ko/about',
  '/ko/contact',
];

const WIDTHS = [320, 375, 768, 1024, 1280];

const PROBE_FN = `(() => {
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
        cls: (el.className || '').toString().slice(0, 80),
        right: Math.round(r.right),
        vw,
      });
    }
  });
  let below24 = 0, t24to43 = 0;
  const worst = [];
  document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    const min = Math.min(r.width, r.height);
    const text = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 60);
    if (min < 24) {
      below24++;
      if (worst.length < 5 && !text.includes('Skip to main')) worst.push({ text, w: Math.round(r.width), h: Math.round(r.height) });
    } else if (min < 44) t24to43++;
  });
  return {
    overflowX,
    delta,
    overflowNodes: overflowNodes.slice(0, 8),
    below24,
    t24to43,
    worst,
  };
})()`;

function extractProbe(html) {
  const marker = 'window.__PROBE__=';
  const i = html.indexOf(marker);
  if (i === -1) return null;
  const start = i + marker.length;
  const end = html.indexOf(';</script>', start);
  if (end === -1) return null;
  try {
    return JSON.parse(html.slice(start, end));
  } catch {
    return null;
  }
}

async function measureRoute(route, width) {
  const url = `${SITE}${route}`;
  const html = await fetch(url, { headers: { Accept: 'text/html' } }).then((r) => {
    if (!r.ok) throw new Error(`${route} HTTP ${r.status}`);
    return r.text();
  });

  const probeScript = `<script>window.__PROBE__=${PROBE_FN};</script>`;
  const injected = html.replace('</head>', `${probeScript}</head>`);
  const baseHref = `${SITE}${route.startsWith('/') ? route : `/${route}`}`;

  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head><base href="${baseHref}"></head><body>${injected.match(/<body[^>]*>([\\s\\S]*)<\\/body>/i)?.[1] ?? injected}</body></html>`,
    {
      url: baseHref,
      pretendToBeVisual: true,
      resources: 'usable',
      runScripts: 'dangerously',
    },
  );

  dom.window.resizeTo(width, 800);
  await new Promise((r) => setTimeout(r, 50));

  const probe = dom.window.__PROBE__;
  if (!probe) {
    return { route, width, error: 'probe missing' };
  }
  return { route, width, ...probe };
}

async function main() {
  let jsdom;
  try {
    jsdom = await import('jsdom');
  } catch {
    console.error('Install jsdom: npm install -D jsdom');
    process.exit(1);
  }
  void jsdom;

  const results = [];
  const issues = [];

  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      try {
        const row = await measureRoute(route, width);
        results.push(row);
        if (row.overflowX) {
          issues.push({
            severity: 'P0',
            type: 'overflow',
            route,
            width,
            delta: row.delta,
            nodes: row.overflowNodes,
          });
        }
        if (row.below24 > 20) {
          issues.push({
            severity: 'P1',
            type: 'tap_below24',
            route,
            width,
            count: row.below24,
            worst: row.worst,
          });
        }
      } catch (e) {
        results.push({ route, width, error: String(e.message || e) });
        issues.push({ severity: 'P0', type: 'load_error', route, width, error: String(e) });
      }
    }
  }

  const overflowCount = results.filter((r) => r.overflowX).length;
  const summary = {
    generatedAt: new Date().toISOString(),
    site: SITE,
    cells: results.length,
    overflowFailures: overflowCount,
    loadErrors: results.filter((r) => r.error).length,
    issues,
    results,
  };

  const fs = await import('fs');
  const path = await import('path');
  const outDir = path.join(process.cwd(), 'audit', 'raw');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'visual-recheck.json'),
    JSON.stringify(summary, null, 2),
  );

  console.log(`Cells: ${summary.cells}`);
  console.log(`Overflow failures: ${overflowCount}`);
  console.log(`Load errors: ${summary.loadErrors}`);
  console.log(`Issues flagged: ${issues.length}`);
  if (issues.length) {
    console.log('\nTop issues:');
    for (const i of issues.slice(0, 15)) {
      console.log(`  [${i.severity}] ${i.type} ${i.route} @ ${i.width}px`, i.delta ?? i.count ?? i.error ?? '');
    }
  } else {
    console.log('\nNo overflow or major tap-target regressions in sampled matrix.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
