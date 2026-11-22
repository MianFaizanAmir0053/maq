import { NextResponse } from 'next/server';
import { SITE } from '@/lib/site';

/*
  Receives the catering and contact forms and emails them to the shop.

  By default each enquiry is emailed to SITE.email (or ENQUIRY_EMAIL, if set) through
  FormSubmit (formsubmit.co), which needs no account or API key. The very first
  submission makes FormSubmit send an "Activate form" email to that inbox; until someone
  clicks the button in it, enquiries are not delivered.

  To send somewhere else instead, set ENQUIRY_WEBHOOK_URL to any endpoint that accepts a
  JSON POST (a Zapier/Make webhook, Slack incoming webhook, your own service).
*/

const LIMITS: Record<string, number> = { message: 4000 };
const MAX = 300;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED: Record<string, string[]> = {
  catering: ['name', 'email', 'phone', 'date', 'guests', 'type'],
  contact: ['name', 'email', 'message'],
};

/** Field labels for the email, in the order they appear on the forms. */
const LABELS: Record<string, string> = {
  name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', date: 'Event date',
  guests: 'Guests', type: 'Event type', suburb: 'Suburb', menu: 'Menu', topic: 'Topic', message: 'Message',
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

  // hidden field that people never see; bots that fill it in get a quiet "ok"
  if (data.website) return NextResponse.json({ ok: true });

  const kind = data.form;
  const required = REQUIRED[kind];
  if (!required) return NextResponse.json({ ok: false, error: 'Unknown form' }, { status: 400 });
  const missing = required.filter(k => !data[k]);
  if (missing.length) return NextResponse.json({ ok: false, error: 'Missing fields', fields: missing }, { status: 422 });
  if (!EMAIL.test(data.email)) return NextResponse.json({ ok: false, error: 'Invalid email', fields: ['email'] }, { status: 422 });

  try {
    if (process.env.ENQUIRY_WEBHOOK_URL) await toWebhook(process.env.ENQUIRY_WEBHOOK_URL, kind, data);
    else await toEmail(process.env.ENQUIRY_EMAIL || SITE.email, kind, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[MAQ] Could not deliver ${kind} enquiry:`, err);
    return NextResponse.json({ ok: false, error: 'Could not send right now' }, { status: 502 });
  }
}

async function toWebhook(url: string, kind: string, data: Record<string, string>) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, form: kind, receivedAt: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error('Webhook responded ' + r.status);
}

async function toEmail(to: string, kind: string, data: Record<string, string>) {
  const fields: Record<string, string> = {};
  for (const [k, label] of Object.entries(LABELS)) if (data[k]) fields[label] = data[k];

  const subject = kind === 'catering'
    ? `Catering enquiry: ${data.name}, ${data.guests} guests on ${data.date}`
    : `Website message: ${data.topic || 'General question'} from ${data.name}`;

  const r = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // FormSubmit ties a form to the site it is sent from
      Origin: SITE.url,
      Referer: SITE.url + (kind === 'catering' ? '/catering' : '/contact'),
    },
    body: JSON.stringify({
      ...fields,
      _subject: subject,
      _replyto: data.email, // "Reply" in the inbox goes straight to the customer
      _template: 'table',
      _captcha: 'false',
    }),
  });
  const res = (await r.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
  // FormSubmit answers 200 with success "false" while the form is waiting for activation
  if (!r.ok || !res || String(res.success) !== 'true') {
    throw new Error(`FormSubmit ${r.status}: ${res?.message ?? 'no response'}`);
  }
}
