import { NextResponse } from 'next/server';
import {
  callbackSchema,
  fullSchema,
  type CallbackInput,
  type FullInput,
} from '@/lib/referral-schema';
import { runFormPipeline, extractIp } from '@/lib/form-pipeline';
import { sendReferralCallbackEmail, sendReferralFullEmail } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const hasBaa = process.env.HAS_BAA === 'true';

export async function POST(req: Request) {
  if (req.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return NextResponse.json(
      { ok: false, error: 'common.formErrors.serverError' },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'common.formErrors.serverError' },
      { status: 400 },
    );
  }

  const mode =
    body && typeof body === 'object' && 'mode' in body
      ? (body as { mode?: unknown }).mode
      : undefined;

  // Defense in depth: a stale client (or attacker) sending mode='full'
  // when no BAA is in place is rejected before any PHI is parsed.
  if (mode === 'full' && !hasBaa) {
    return NextResponse.json(
      { ok: false, error: 'common.formErrors.serverError' },
      { status: 400 },
    );
  }

  const ip = extractIp(req.headers);

  if (mode === 'full') {
    const result = await runFormPipeline<typeof fullSchema>({
      schema: fullSchema,
      body,
      ip,
      send: (input: FullInput) => sendReferralFullEmail(input),
    });
    return NextResponse.json(result.payload, {
      status: result.status,
      headers: { 'Cache-Control': 'no-store', ...(result.headers ?? {}) },
    });
  }

  const result = await runFormPipeline<typeof callbackSchema>({
    schema: callbackSchema,
    body,
    ip,
    send: (input: CallbackInput) => sendReferralCallbackEmail(input),
  });
  return NextResponse.json(result.payload, {
    status: result.status,
    headers: { 'Cache-Control': 'no-store', ...(result.headers ?? {}) },
  });
}
