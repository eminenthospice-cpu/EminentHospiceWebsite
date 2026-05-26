import { randomUUID, createHash } from 'crypto';
import { ZodError, type ZodTypeAny, type infer as zInfer } from 'zod';
import { checkRateLimit } from './rate-limit';
import { verifyTurnstile } from './turnstile';

export type PipelineRequest = {
  schema: ZodTypeAny;
  body: unknown;
  ip: string;
  send: (input: never) => Promise<{ ok: boolean }>;
};

export type PipelineResponse = {
  status: number;
  payload: Record<string, unknown>;
  headers?: Record<string, string>;
};

function hashIp(ip: string): string {
  // Daily salt so the hash rotates and is never a stable user identifier.
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${ip}|${day}`).digest('hex').slice(0, 16);
}

// Generic pipeline: honeypot → rate-limit → turnstile → zod → sender.
// Honeypot tripping returns 200 silently so bots have no oracle. We log
// only opaque identifiers — never the request body.
export async function runFormPipeline<S extends ZodTypeAny>(args: {
  schema: S;
  body: unknown;
  ip: string;
  send: (input: zInfer<S>) => Promise<{ ok: boolean }>;
}): Promise<PipelineResponse> {
  const { schema, body, ip, send } = args;
  const requestId = randomUUID();
  const ipKey = hashIp(ip);

  // 1. Honeypot — populated => silent success, no email sent.
  if (
    body &&
    typeof body === 'object' &&
    'companyWebsite' in (body as Record<string, unknown>) &&
    typeof (body as Record<string, unknown>).companyWebsite === 'string' &&
    ((body as Record<string, unknown>).companyWebsite as string).length > 0
  ) {
    // Intentional silent 200 — denies bots a signal that the trap fired.
    console.info(`[form] honeypot tripped id=${requestId} ip=${ipKey}`);
    return { status: 200, payload: { ok: true } };
  }

  // 2. Rate limit — per-IP.
  const rl = checkRateLimit(ipKey);
  if (!rl.ok) {
    return {
      status: 429,
      payload: { ok: false, error: 'common.formErrors.rateLimited' },
      headers: { 'Retry-After': String(rl.retryAfterSeconds) },
    };
  }

  // 3. Zod validation — re-validate server-side against the same schema the
  //    client used. Single source of truth.
  let parsed: zInfer<S>;
  try {
    parsed = schema.parse(body) as zInfer<S>;
  } catch (err) {
    if (err instanceof ZodError) {
      console.warn(`[form] zod fail id=${requestId} ip=${ipKey}`);
      return {
        status: 400,
        payload: { ok: false, error: 'common.formErrors.serverError' },
      };
    }
    throw err;
  }

  // 4. Turnstile.
  const token = (parsed as { turnstileToken?: string }).turnstileToken ?? '';
  const tsOk = await verifyTurnstile(token, ip);
  if (!tsOk) {
    return {
      status: 400,
      payload: { ok: false, error: 'common.formErrors.turnstileFailed' },
    };
  }

  // 5. Send. Body content is never logged.
  try {
    const result = await send(parsed);
    if (!result.ok) {
      console.error(`[form] sender fail id=${requestId} ip=${ipKey}`);
      return {
        status: 502,
        payload: { ok: false, error: 'common.formErrors.serverError' },
      };
    }
    console.info(`[form] ok id=${requestId} ip=${ipKey}`);
    return { status: 200, payload: { ok: true } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error(`[form] exception id=${requestId} ip=${ipKey} msg=${message}`);
    return {
      status: 500,
      payload: { ok: false, error: 'common.formErrors.serverError' },
    };
  }
}

export function extractIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  return '0.0.0.0';
}
