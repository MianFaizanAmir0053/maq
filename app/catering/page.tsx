import type { Metadata } from 'next';
import Pic from '@/components/Pic';
import ScrollLink from '@/components/ScrollLink';
import { CateringForm } from '@/components/forms';
import { SITE, mailHref, telHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Catering',
  description: 'MAQ Burgers catering: smash burgers, crispy chicken, hot pizzas and loaded fries for offices, parties, clubs and community events.',
};

const OCCASIONS = [
  ['/assets/img-01-d0872144.jpg', 'Office lunches'],
  ['/assets/img-03-1096dc4e.jpg', 'Birthdays & parties'],
  ['/assets/img-02-9e6f5045.jpg', 'Sports clubs'],
  ['/assets/img-04-843dc6a3.jpg', 'Community events'],
];

export default function CateringPage() {
  return (
    <main id="main" className="page-view" tabIndex={-1}>
      <section className="view" id="view-catering" aria-labelledby="catering-title">
        <div className="vhero">
          <Pic className="vhero-img" src="/assets/img-09-1306451b.webp" alt="" aria-hidden="true" preload sizes="100vw" />
          <div className="wrap vhero-tx">
            <span className="eyebrow-l">MAQ Catering</span>
            <h1 className="vh1" id="catering-title" tabIndex={-1}>Feed the<br />whole crew</h1>
            <p className="vlead">
              Smash burgers, crispy chicken, hot pizzas and loaded fries for offices, parties, clubs and community events.
              Tell us what you’re planning and we’ll come back with a menu and a quote.
            </p>
            <ScrollLink className="vcta" to="enquiry">Start your enquiry <span aria-hidden="true">↓</span></ScrollLink>
          </div>
        </div>

        <div className="wrap vsec">
          <div className="vhead"><span className="eyebrow-l">How it works</span><h2 className="vh2">Three steps to a well-fed event</h2></div>
          <ol className="steps">
            <li><span className="st-n">01</span><h3>Tell us about it</h3><p>Send the date, headcount and the kind of event using the form below.</p></li>
            <li><span className="st-n">02</span><h3>We build the menu</h3><p>We put together a selection from our burgers, chicken, pizzas and loaded fries to suit your crowd.</p></li>
            <li><span className="st-n">03</span><h3>Confirm and enjoy</h3><p>We confirm the details, timings and quote with you, then get cooking.</p></li>
          </ol>
        </div>

        <div className="wrap vsec">
          <div className="vhead"><span className="eyebrow-l">Perfect for</span><h2 className="vh2">Any table, any size</h2></div>
          <ul className="occ">
            {OCCASIONS.map(([src, label]) => (
              <li key={label}><Pic src={src} alt="" sizes="(max-width: 700px) 50vw, 25vw" /><span>{label}</span></li>
            ))}
          </ul>
        </div>

        <div className="wrap vsec" id="enquiry">
          <div className="fcard">
            <div className="fside">
              <span className="eyebrow-l">Catering enquiry</span>
              <h2 className="vh2">Tell us about your event</h2>
              <p>Fields marked <span className="req" aria-hidden="true">*</span> are required. We’ll reply to confirm availability and send a quote.</p>
              <ul className="fmeta">
                <li><span>Call</span><a href={telHref}>{SITE.phone}</a></li>
                <li><span>Email</span><a href={mailHref}>{SITE.email}</a></li>
              </ul>
            </div>
            <CateringForm />
          </div>
        </div>
      </section>
    </main>
  );
}
