import { NextResponse } from 'next/server';
import { SITE } from '@/lib/site';

/*
  Receives the catering and contact forms and emails them to the shop with Resend (resend.com).

  Settings (Vercel → Project → Settings → Environment Variables, or .env.local):
    RESEND_API_KEY  required. Never commit it: the repository is public.
    ENQUIRY_TO      inbox that receives enquiries. Defaults to SITE.email. Until a domain is
                    verified in Resend, this must be the Resend account's own address.
    RESEND_FROM     sender. Defaults to Resend's shared test sender, which may only email the
                    Resend account's own address. To email anyone else, verify maqburgers.com.au
                    at resend.com/domains and set e.g. "MAQ Burgers <website@maqburgers.com.au>".
*/

/** Name of the hidden spam-trap field; must match TRAP in components/forms.tsx. */
const TRAP = 'hp_x7';

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

  // Hidden spam-trap field (TRAP in components/forms.tsx). People never see it, but browser
  // autofill has filled such fields before, so the enquiry is still sent, just flagged.
  const trap = (body as Record<string, unknown>)[TRAP];
  const suspect = typeof trap === 'string' && trap.trim() !== '';

  const kind = data.form;
  const required = REQUIRED[kind];
  if (!required) return NextResponse.json({ ok: false, error: 'Unknown form' }, { status: 400 });
  const missing = required.filter(k => !data[k]);
  if (missing.length) return NextResponse.json({ ok: false, error: 'Missing fields', fields: missing }, { status: 422 });
  if (!EMAIL.test(data.email)) return NextResponse.json({ ok: false, error: 'Invalid email', fields: ['email'] }, { status: 422 });

  if (suspect) console.warn(`[MAQ] ${kind} enquiry has the spam trap filled; sending it flagged as possible spam`);

  try {
    await sendEmail(kind, data, suspect);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[MAQ] Could not send ${kind} enquiry:`, err);
    return NextResponse.json({ ok: false, error: 'Could not send right now' }, { status: 502 });
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function sendEmail(kind: string, data: Record<string, string>, suspect: boolean) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  const rows = Object.entries(LABELS).filter(([k]) => data[k]).map(([k, label]) => [label, data[k]] as const);
  const title = kind === 'catering' ? 'New catering enquiry' : 'New website message';
  const subject = (suspect ? '[Possible spam] ' : '') + (kind === 'catering'
    ? `Catering enquiry: ${data.name}, ${data.guests} guests on ${data.date}`
    : `Website message: ${data.topic || 'General question'} from ${data.name}`);

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
<h2 style="margin:0 0 12px">${title}</h2>
<table cellpadding="8" style="border-collapse:collapse">
${rows.map(([l, v]) => `<tr><th align="left" valign="top" style="background:#f4f4f4;border:1px solid #ddd;white-space:nowrap">${esc(l)}</th><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join('\n')}
</table>
<p style="color:#666;font-size:13px">Reply to this email to answer ${esc(data.name)} directly.</p>
</div>`;
  const text = `${title}\n\n${rows.map(([l, v]) => `${l}: ${v}`).join('\n')}\n\nReply to this email to answer ${data.name} directly.`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'MAQ Burgers Website <onboarding@resend.dev>',
      to: [process.env.ENQUIRY_TO || SITE.email],
      reply_to: data.email, // "Reply" in the inbox goes straight to the customer
      subject,
      html,
      text,
    }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}
