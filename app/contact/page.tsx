import type { Metadata } from 'next';
import HoursList from '@/components/HoursList';
import { ContactForm } from '@/components/forms';
import { SITE, mailHref, mapsHref, telHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions about the MAQ Burgers menu, allergens or a big order? Send us a message or come and see us.',
};

const ico = (path: React.ReactNode) => (
  <span className="cc-ico" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">{path}</svg>
  </span>
);

export default function ContactPage() {
  return (
    <main id="main" className="page-view" tabIndex={-1}>
      <section className="view" id="view-contact" aria-labelledby="contact-title">
        <div className="wrap vsec vtop">
          <div className="vhead vhead-xl">
            <span className="eyebrow-l">Contact</span>
            <h1 className="vh1" id="contact-title" tabIndex={-1}>Get in touch</h1>
            <p className="vlead">Questions about the menu, allergens or a big order? Send us a message or come and see us.</p>
          </div>
          <div className="cgrid">
            <div className="ccards">
              <div className="ccard" id="visit">
                {ico(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>)}
                <div><h2>Visit</h2><p>{SITE.address}</p><a className="clink" href={mapsHref} target="_blank" rel="noopener">Get directions ↗</a></div>
              </div>
              <div className="ccard">
                {ico(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />)}
                <div><h2>Call</h2><p><a href={telHref}>{SITE.phone}</a></p></div>
              </div>
              <div className="ccard">
                {ico(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>)}
                <div><h2>Email</h2><p><a href={mailHref}>{SITE.email}</a></p></div>
              </div>
              <div className="ccard hours" id="hours">
                {ico(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>)}
                <div><h2>Opening hours</h2><HoursList /></div>
              </div>
            </div>
            <div className="fcard fcard-c" id="message">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
