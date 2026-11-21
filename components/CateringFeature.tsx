'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Pic from './Pic';

const OCCASIONS = ['Office lunches', 'Birthdays', 'Sports clubs', 'Community events', 'School functions', 'Family gatherings'];

/** Homepage catering promo: a scrolling ribbon, then a headline and photo collage that animate in on scroll. */
export default function CateringFeature() {
  const root = useRef<HTMLElement>(null);

  // reveal once the section scrolls into view
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ribbon = [...OCCASIONS, ...OCCASIONS];

  return (
    <section className="cfeat" id="catering" aria-labelledby="cfeat-title" ref={root}>
      <Link href="/catering" className="cf-ribbon" aria-label="MAQ catering for offices, parties, clubs and events">
        <span className="cf-track" aria-hidden="true">
          {[0, 1].map(n => (
            <span key={n}>
              {ribbon.map((o, i) => <span key={i}><b>Catering</b><i>✦</i>{o}<i>✦</i></span>)}
            </span>
          ))}
        </span>
      </Link>

      <div className="wrap cf-in">
        <div className="cf-copy">
          <span className="cf-live"><span className="cf-dot" aria-hidden="true" />Now taking catering bookings</span>
          <h2 className="cf-h" id="cfeat-title">
            <span className="cf-line"><span>Feeding</span></span>
            <span className="cf-line"><span>a crowd?</span></span>
          </h2>
          <p className="cf-lead">
            Smash burgers, crispy chicken burgers, hot pizzas and loaded fries, made fresh for your office, party, club or event.
            Tell us the date and headcount and we’ll come back with a menu and a quote.
          </p>
          <ul className="cf-steps">
            <li><span>01</span>Send your enquiry</li>
            <li><span>02</span>We build the menu</li>
            <li><span>03</span>We cook, you enjoy</li>
          </ul>
          <div className="cf-ctas">
            <Link href="/catering#enquiry" className="cf-btn">
              <span>Get a catering quote</span><i aria-hidden="true">→</i>
            </Link>
            <Link href="/catering" className="cf-link">See how it works</Link>
          </div>
        </div>

        <div className="cf-art" aria-hidden="true">
          <div className="cf-ph cf-ph-a"><Pic src="/assets/img-23-c7ed8510.jpg" alt="" sizes="(max-width: 900px) 80vw, 420px" /></div>
          <div className="cf-ph cf-ph-b"><Pic src="/assets/img-21-80a29e8a.jpg" alt="" sizes="(max-width: 900px) 50vw, 300px" /></div>
          <div className="cf-ph cf-ph-c"><Pic src="/assets/img-15-22505d70.jpg" alt="" sizes="(max-width: 900px) 40vw, 220px" /></div>
          <span className="cf-badge"><b>Any size</b><small>offices to parties</small></span>
        </div>
      </div>
    </section>
  );
}
