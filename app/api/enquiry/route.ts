import { NextResponse } from 'next/server';

/*
  Receives the catering and contact forms.

  To deliver submissions, set ENQUIRY_WEBHOOK_URL (in .env.local or your host's settings)
  to any endpoint that accepts a JSON POST: a Formspree form, Zapier/Make webhook,
  Slack incoming webhook, or your own service. Without it, submissions are only logged
  on the server, which is fine for local development.
*/

const LIMITS: Record<string, number> = { message: 4000 };
const MAX = 300;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED: Record<string, string[]> = {
  catering: ['name', 'email', 'phone', 'date', 'guests', 'type'],
  contact: ['name', 'email', 'message'],
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
  }

  // keep only short string fields
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (typeof v !== 'string' || !/^[a-z]{1,20}$/.test(k)) continue;
    data[k] = v.trim().slice(0, LIMITS[k] ?? MAX);
  }

  const kind = data.form;
  const required = REQUIRED[kind];
  if (!required) return NextResponse.json({ ok: false, error: 'Unknown form' }, { status: 400 });
  const missing = required.filter(k => !data[k]);
  if (missing.length) return NextResponse.json({ ok: false, error: 'Missing fields', fields: missing }, { status: 422 });
  if (!EMAIL.test(data.email)) return NextResponse.json({ ok: false, error: 'Invalid email', fields: ['email'] }, { status: 422 });

  const payload = { ...data, receivedAt: new Date().toISOString() };
  const url = process.env.ENQUIRY_WEBHOOK_URL;

  if (!url) {
    console.info(`[MAQ] ${kind} enquiry (no ENQUIRY_WEBHOOK_URL set, not forwarded):`, payload);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Webhook responded ' + r.status);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[MAQ] Could not forward enquiry:', err);
    return NextResponse.json({ ok: false, error: 'Could not send right now' }, { status: 502 });
  }
}
