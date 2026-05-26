import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { runFormPipeline, extractIp } from '@/lib/form-pipeline';
import { sendContactEmail } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const result = await runFormPipeline({
    schema: contactSchema,
    body,
    ip: extractIp(req.headers),
    send: sendContactEmail,
  });

  return NextResponse.json(result.payload, {
    status: result.status,
    headers: { 'Cache-Control': 'no-store', ...(result.headers ?? {}) },
  });
}
