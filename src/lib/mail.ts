import { Resend } from 'resend';
import type { ContactInput } from './contact-schema';
import type { CallbackInput, FullInput } from './referral-schema';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Eminent Hospice <no-reply@example.com>';
const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? '';
const REFERRAL_TO = process.env.REFERRAL_TO_EMAIL ?? '';

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function patientInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  return parts
    .map((p) => p[0]?.toUpperCase() ?? '')
    .filter(Boolean)
    .join('.');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value: string | undefined): string {
  if (!value) return '';
  return `<tr><th style="text-align:left;padding:4px 8px;background:#f3f0e9">${escapeHtml(
    label,
  )}</th><td style="padding:4px 8px">${escapeHtml(value)}</td></tr>`;
}

export async function sendContactEmail(input: ContactInput): Promise<{ ok: boolean }> {
  const client = getClient();
  if (!client || !CONTACT_TO) return { ok: false };

  const subject = `New website inquiry — ${input.name}`;
  const text =
    `New contact-form submission\n\n` +
    `Name: ${input.name}\n` +
    `Email: ${input.email}\n` +
    `Phone: ${input.phone || '—'}\n` +
    `Subject: ${input.subject}\n` +
    `Locale: ${input.locale}\n\n` +
    `Message:\n${input.message}\n`;

  const html =
    `<h2>New contact-form submission</h2>` +
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    row('Name', input.name) +
    row('Email', input.email) +
    row('Phone', input.phone || undefined) +
    row('Subject', input.subject) +
    row('Locale', input.locale) +
    `</table>` +
    `<h3 style="font-family:sans-serif;font-size:14px">Message</h3>` +
    `<pre style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escapeHtml(input.message)}</pre>`;

  const { error } = await client.emails.send({
    from: FROM,
    to: CONTACT_TO,
    subject,
    replyTo: input.email,
    text,
    html,
  });
  return { ok: !error };
}

export async function sendReferralCallbackEmail(input: CallbackInput): Promise<{ ok: boolean }> {
  const client = getClient();
  const to = REFERRAL_TO || CONTACT_TO;
  if (!client || !to) return { ok: false };

  const subject = `New callback request — ${input.referrerName}`;
  const text =
    `New referral callback request (no PHI collected)\n\n` +
    `Referrer name: ${input.referrerName}\n` +
    `Referrer phone: ${input.referrerPhone}\n` +
    `Referrer email: ${input.referrerEmail || '—'}\n` +
    `Best time to call: ${input.bestTimeToCall}\n` +
    `Referrer type: ${input.referrerType}\n` +
    `Locale: ${input.locale}\n`;

  const html =
    `<h2>New referral callback request</h2>` +
    `<p>No patient health information was collected on this form.</p>` +
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    row('Referrer name', input.referrerName) +
    row('Referrer phone', input.referrerPhone) +
    row('Referrer email', input.referrerEmail || undefined) +
    row('Best time to call', input.bestTimeToCall) +
    row('Referrer type', input.referrerType) +
    row('Locale', input.locale) +
    `</table>`;

  const { error } = await client.emails.send({
    from: FROM,
    to,
    subject,
    replyTo: input.referrerEmail || undefined,
    text,
    html,
  });
  return { ok: !error };
}

export async function sendReferralFullEmail(input: FullInput): Promise<{ ok: boolean }> {
  const client = getClient();
  const to = REFERRAL_TO || CONTACT_TO;
  if (!client || !to) return { ok: false };

  // Subject uses initials only so PHI does not bleed into mail-server logs.
  const subject = `New referral — ${patientInitials(input.patientName)}`;

  const text =
    `New referral submission (PHI present — BAA must be in place)\n\n` +
    `-- Referrer --\n` +
    `Name: ${input.referrerName}\n` +
    `Phone: ${input.referrerPhone}\n` +
    `Email: ${input.referrerEmail}\n` +
    `Relationship: ${input.referrerRelationship}\n` +
    `Referring physician: ${input.referringPhysician || '—'}\n` +
    `Physician NPI: ${input.referringPhysicianNpi || '—'}\n\n` +
    `-- Patient --\n` +
    `Name: ${input.patientName}\n` +
    `DOB: ${input.patientDob}\n` +
    `Diagnosis: ${input.primaryDiagnosis}\n` +
    `Urgency: ${input.urgency}\n` +
    `Current location: ${input.currentLocation}\n` +
    `Preferred language: ${input.preferredLanguage}\n\n` +
    `-- Insurance --\n` +
    `Type: ${input.insuranceType}\n` +
    `Member ID: ${input.insuranceMemberId || '—'}\n\n` +
    `Notes:\n${input.notes || '—'}\n`;

  const html =
    `<h2>New referral submission</h2>` +
    `<p><strong>Contains protected health information (PHI).</strong></p>` +
    `<h3>Referrer</h3>` +
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    row('Name', input.referrerName) +
    row('Phone', input.referrerPhone) +
    row('Email', input.referrerEmail) +
    row('Relationship', input.referrerRelationship) +
    row('Referring physician', input.referringPhysician || undefined) +
    row('Physician NPI', input.referringPhysicianNpi || undefined) +
    `</table>` +
    `<h3>Patient</h3>` +
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    row('Name', input.patientName) +
    row('DOB', input.patientDob) +
    row('Diagnosis', input.primaryDiagnosis) +
    row('Urgency', input.urgency) +
    row('Current location', input.currentLocation) +
    row('Preferred language', input.preferredLanguage) +
    `</table>` +
    `<h3>Insurance</h3>` +
    `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    row('Type', input.insuranceType) +
    row('Member ID', input.insuranceMemberId || undefined) +
    `</table>` +
    (input.notes
      ? `<h3>Notes</h3><pre style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escapeHtml(input.notes)}</pre>`
      : '');

  const { error } = await client.emails.send({
    from: FROM,
    to,
    subject,
    replyTo: input.referrerEmail,
    text,
    html,
  });
  return { ok: !error };
}
