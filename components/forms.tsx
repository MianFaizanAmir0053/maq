'use client';

import {
  cloneElement, createContext, useContext, useEffect, useRef, useState,
  type FormEvent, type ReactElement, type ReactNode,
} from 'react';
import { SITE, telHref } from '@/lib/site';
import { useIsClient } from '@/lib/useClient';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Kind = 'catering' | 'contact';

const Errors = createContext<Record<string, string>>({});

/** The message for a field, from the browser's constraint validation. Empty when valid. */
function messageFor(el: Field) {
  const v = el.validity;
  const label = (el.dataset.label || 'this field').toLowerCase();
  if (v.valueMissing) return el.tagName === 'SELECT' ? 'Please choose an ' + label + '.' : 'Please enter your ' + label + '.';
  if (v.typeMismatch && el.type === 'email') return 'Please enter a valid email, like name@example.com.';
  if (v.patternMismatch && el.type === 'tel') return 'Please enter a valid phone number.';
  if (v.rangeUnderflow && el.type === 'number') return 'Catering starts from ' + (el as HTMLInputElement).min + ' guests. For smaller groups, just order in store.';
  if (v.rangeOverflow) return 'For more than ' + (el as HTMLInputElement).max + ' guests, please call us.';
  if (v.rangeUnderflow && el.type === 'date') return 'Please choose a date from today onwards.';
  if (v.tooShort) return 'Please add a little more detail (at least ' + (el as HTMLTextAreaElement).minLength + ' characters).';
  if (!v.valid) return 'Please check this field.';
  return '';
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  full?: boolean;
  /** wraps the control in the custom select styling */
  select?: boolean;
  children: ReactElement<Record<string, unknown>>;
};

/** A labelled form control with its inline error message. */
export function Fld({ id, label, required, full, select, children }: FieldProps) {
  const msg = useContext(Errors)[id];
  const errId = id + '-err';
  const control = cloneElement(children, {
    id,
    required,
    'data-label': label,
    'aria-invalid': msg ? true : undefined,
    'aria-describedby': msg ? errId : undefined,
  });
  return (
    <div className={'fld' + (full ? ' full' : '') + (msg ? ' invalid' : '')}>
      <label htmlFor={id}>{label}{required && <> <span className="req">*</span></>}</label>
      {select ? <div className="sel">{control}</div> : control}
      <p className="err" id={errId}>{msg}</p>
    </div>
  );
}

type Done = { first: string; email: string };

/** Field labels for the email, in the order they appear on the forms. */
const LABELS: Record<string, string> = {
  name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', date: 'Event date',
  guests: 'Guests', type: 'Event type', suburb: 'Suburb', menu: 'Menu', topic: 'Topic', message: 'Message',
};

/**
 * Emails an enquiry to the shop through FormSubmit (formsubmit.co), which needs no account or key.
 * It is sent from the visitor's browser because FormSubmit blocks requests from hosting servers
 * such as Vercel's. The first enquiry makes FormSubmit email SITE.email an "Activate form" link,
 * and nothing is delivered until someone clicks it.
 */
async function sendEnquiry(kind: Kind, data: Record<string, string>) {
  const rows: Record<string, string> = {};
  for (const [k, label] of Object.entries(LABELS)) if (data[k]) rows[label] = data[k];
  const subject = kind === 'catering'
    ? `Catering enquiry: ${data.name}, ${data.guests} guests on ${data.date}`
    : `Website message: ${data.topic || 'General question'} from ${data.name}`;

  const r = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(SITE.email), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...rows,
      _subject: subject,
      _replyto: data.email, // "Reply" in the inbox goes straight to the customer
      _template: 'table',
      _captcha: 'false',
    }),
  });
  const res = (await r.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
  // FormSubmit answers 200 with success "false" while the form is waiting for activation
  if (!r.ok || String(res?.success) !== 'true') throw new Error(`FormSubmit ${r.status}: ${res?.message ?? 'no response'}`);
}

/** Shared behaviour for the catering and contact forms: validation, sending and the thank-you state. */
function EnquiryForm({ kind, id, submitLabel, children, before }: {
  kind: Kind; id: string; submitLabel: string; children: ReactNode; before?: ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ bad: boolean; text: ReactNode }>({ bad: false, text: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const fields = () =>
    [...(form.current?.querySelectorAll<Field>('input:not([type=checkbox]):not([name=website]),select,textarea') ?? [])];

  const check = (el: Field) => {
    const msg = messageFor(el);
    setErrors(e => (e[el.id] === msg ? e : { ...e, [el.id]: msg }));
    return !msg;
  };

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ bad: false, text: '' });
    const bad = fields().filter(el => !check(el));
    if (bad.length) {
      setStatus({ bad: true, text: bad.length === 1 ? 'Please fix the highlighted field.' : 'Please fix the ' + bad.length + ' highlighted fields.' });
      bad[0].focus();
      return;
    }
    const fd = new FormData(form.current!);
    const data: Record<string, string> = {};
    fd.forEach((value, key) => { if (key !== 'menu') data[key] = String(value).trim(); });
    const menu = fd.getAll('menu').map(String);
    if (menu.length) data.menu = menu.join(', ');
    const thanks = { first: (data.name || '').split(/\s+/)[0], email: data.email };

    // the hidden spam-trap field was filled in, so this is a bot: look done, send nothing
    if (data.website) { setDone(thanks); return; }

    setSending(true);
    try {
      await sendEnquiry(kind, data);
      setDone(thanks);
    } catch (err) {
      console.error('[MAQ] Enquiry not sent:', err); // shows FormSubmit's reason in the browser console
      setStatus({
        bad: true,
        text: <>Sorry, that didn’t send. Please try again or call <a href={telHref}>{SITE.phone}</a>.</>,
      });
    } finally {
      setSending(false);
    }
  };

  const again = () => {
    form.current?.reset();
    setErrors({});
    setStatus({ bad: false, text: '' });
    setDone(null);
    requestAnimationFrame(() => fields()[0]?.focus());
  };

  return (
    <Errors.Provider value={errors}>
      <form
        ref={form}
        className="xform"
        id={id}
        noValidate
        data-kind={kind}
        hidden={!!done}
        onSubmit={onSubmit}
        onBlur={e => {
          const el = e.target as EventTarget as Field;
          if (el.matches?.('input:not([type=checkbox]),select,textarea') && (el.value || errors[el.id])) check(el);
        }}
        onInput={e => {
          const el = e.target as EventTarget as Field;
          if (errors[el.id]) check(el);
        }}
      >
        {before}
        {/* spam trap: hidden from people and screen readers, so only bots fill it in */}
        <input
          type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
        <div className="fgrid">{children}</div>
        <div className="factions">
          <button className="fbtn" type="submit" disabled={sending}>
            <span>{sending ? 'Sending…' : submitLabel}</span><span aria-hidden="true">→</span>
          </button>
          <p className={'fstatus' + (status.bad ? ' bad' : '')} role="status" aria-live="polite">{status.text}</p>
        </div>
      </form>
      {done && (
        <div className="fdone" tabIndex={-1} ref={doneRef}>
          <span className="tick" aria-hidden="true">✓</span>
          <h3>Thank you{done.first ? ', ' + done.first : ''}</h3>
          <p>
            {kind === 'catering'
              ? <>We’ve got your catering enquiry and will be in touch at <strong>{done.email}</strong> to confirm the details and send a quote.</>
              : <>Your message is on its way. We’ll reply to <strong>{done.email}</strong> as soon as we can.</>}
          </p>
          <button type="button" onClick={again}>Send another</button>
        </div>
      )}
    </Errors.Provider>
  );
}

export function CateringForm() {
  // today's date in the visitor's timezone, so past dates can't be picked
  const client = useIsClient();
  let minDate: string | undefined;
  if (client) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    minDate = d.toISOString().slice(0, 10);
  }

  return (
    <EnquiryForm kind="catering" id="catering-form" submitLabel="Send enquiry">
      <Fld id="c-name" label="Full name" required><input name="name" autoComplete="name" /></Fld>
      <Fld id="c-email" label="Email" required><input name="email" type="email" autoComplete="email" /></Fld>
      <Fld id="c-phone" label="Phone" required><input name="phone" type="tel" autoComplete="tel" pattern="[0-9 +\(\)\-]{8,}" /></Fld>
      <Fld id="c-company" label="Company or organisation"><input name="company" autoComplete="organization" /></Fld>
      <Fld id="c-date" label="Event date" required><input name="date" type="date" min={minDate} /></Fld>
      <Fld id="c-guests" label="Number of guests" required><input name="guests" type="number" inputMode="numeric" min={10} max={2000} /></Fld>
      <Fld id="c-type" label="Event type" required select>
        <select name="type" defaultValue="">
          <option value="">Choose one</option>
          <option>Corporate / office</option>
          <option>Birthday or party</option>
          <option>Wedding</option>
          <option>Sports club</option>
          <option>School or community</option>
          <option>Other</option>
        </select>
      </Fld>
      <Fld id="c-suburb" label="Event suburb"><input name="suburb" autoComplete="address-level2" /></Fld>
      <fieldset className="fld full chips">
        <legend>What would you like on the menu?</legend>
        {['Burgers', 'Chicken', 'Pizzas', 'Kebabs', 'Loaded Fries'].map(m => (
          <label key={m}><input type="checkbox" name="menu" value={m} /><span>{m}</span></label>
        ))}
      </fieldset>
      <Fld id="c-msg" label="Anything else we should know?" full>
        <textarea name="message" rows={4} placeholder="Dietary requirements, timings, budget…" />
      </Fld>
    </EnquiryForm>
  );
}

export function ContactForm() {
  const msg = useRef<HTMLTextAreaElement>(null);
  // "Ask about this dish" links here as /contact?dish=<name>
  useEffect(() => {
    const dish = new URLSearchParams(location.search).get('dish');
    if (dish && msg.current && !msg.current.value.trim()) msg.current.value = 'Hi, I have a question about the ' + dish + '. ';
  }, []);

  return (
    <EnquiryForm kind="contact" id="contact-form" submitLabel="Send message" before={<h2 className="vh3">Send a message</h2>}>
      <Fld id="m-name" label="Name" required><input name="name" autoComplete="name" /></Fld>
      <Fld id="m-email" label="Email" required><input name="email" type="email" autoComplete="email" /></Fld>
      <Fld id="m-topic" label="Topic" full select>
        <select name="topic" defaultValue="General question">
          <option>General question</option>
          <option>Allergens &amp; dietary</option>
          <option>Catering</option>
          <option>Feedback</option>
        </select>
      </Fld>
      <Fld id="m-msg" label="Message" required full>
        <textarea ref={msg} name="message" rows={5} minLength={10} />
      </Fld>
    </EnquiryForm>
  );
}
