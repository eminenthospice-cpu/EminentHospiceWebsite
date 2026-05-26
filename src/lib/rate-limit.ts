// Per-IP in-memory rate limiter. Single-instance only — if the deploy ever
// runs on more than one serverless instance, swap the Map for Upstash Redis
// (the public surface here stays the same).

type Entry = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const store = new Map<string, Entry>();

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  // Opportunistic eviction. At low traffic the map stays tiny.
  const expired: string[] = [];
  store.forEach((v, k) => {
    if (v.resetAt <= now) expired.push(k);
  });
  expired.forEach((k) => store.delete(k));

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true };
}

export function _resetRateLimitForTests() {
  store.clear();
}
