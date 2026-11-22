'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Pic from './Pic';

type Slide = { cls: string; name: string; img: string; alt: string; kicker: string; big: string; body: string; href: string; cta: string };

const SLIDES: Slide[] = [
  {
    cls: 's1', name: 'MAQ Classic', img: '/assets/img-35-b46ed744.webp',
    alt: 'MAQ Classic smash burger with melted cheese, diced pickles, onion and ketchup on dark slate.',
    kicker: 'The classic, made properly', big: 'MAQ|CLASSIC',
    body: 'Smashed beef patty, melted cheese, pickles, onion, white special sauce and ketchup. From $10.00.',
    href: '/menu/burgers', cta: 'Explore burgers',
  },
  {
    cls: 's2', name: 'Southern Fried', img: '/assets/img-38-b8940c2a.webp',
    alt: 'Southern Fried chicken burger with crispy fillet, creamy coleslaw and sauce on dark slate.',
    kicker: 'Crunch you can hear', big: 'SOUTHERN|FRIED',
    body: 'Fried chicken fillet, creamy coleslaw, pickles and MAQ sauce. From $16.90.',
    href: '/menu/chicken', cta: 'Explore chicken',
  },
  {
    cls: 's3', name: 'Pizzas', img: '/assets/img-08-78704772.webp',
    alt: 'Pepperoni pizza with melted mozzarella and a separated slice.',
    kicker: 'Fresh from the oven', big: 'BAKED HOT.|MADE TO SHARE.',
    body: 'Ten pizzas, from $20.00. Baked hot and made to share.',
    href: '/menu/pizzas', cta: 'Explore pizzas',
  },
  {
    cls: 's4', name: 'Loaded Fries', img: '/assets/img-39-cdc35d60.webp',
    alt: 'Crispy chicken loaded fries with coleslaw, creamy sauce and parsley on checked paper.',
    kicker: 'Loaded up. Sauced right.', big: 'LOADED|FRIES',
    body: 'French fries, crunchy chicken pieces, creamy coleslaw, MAQ sauce and peri-peri sauce. $18.00.',
    href: '/menu/fries', cta: 'Explore loaded fries',
  },
];

/** The big headline, split into lines and letters for the staggered reveal. */
function BigText({ text }: { text: string }) {
  let i = 0;
  return (
    <h2 className="big" aria-label={text.replace(/\|/g, ' ')}>
      {text.split('|').map((line, li) => (
        <span className="l" aria-hidden="true" key={li}>
          {[...line].map((ch, ci) => {
            i++;
            // a plain space collapses to nothing inside an inline-block letter, so keep it as a non-breaking space
            return <span className="ch" key={ci} style={{ '--i': i, '--r': '0deg', '--s': 1 } as CSSProperties}>{ch === ' ' ? ' ' : ch}</span>;
          })}
        </span>
      ))}
    </h2>
  );
}

/* Sparkles on the Southern Fried slide. A seeded random sequence gives the same
   layout on the server and in the browser, so hydration matches. */
const SPARKLES: CSSProperties[] = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 22 }, () => {
    const z = 2 + rnd() * 3;
    return {
      left: (rnd() * 100).toFixed(2) + '%', width: z.toFixed(2) + 'px', height: z.toFixed(2) + 'px',
      animationDuration: (5 + rnd() * 6).toFixed(2) + 's', animationDelay: (rnd() * 6).toFixed(2) + 's',
      '--x': (rnd() * 160 - 80).toFixed(1) + 'px',
    } as CSSProperties;
  });
})();

export default function HeroSlider() {
  const [ci, setCi] = useState(0);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the first slide's photo loads with the page; the rest follow once the page has finished loading.
  const [warm, setWarm] = useState(false);
  const reduced = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let timer = 0;
    const later = () => { timer = window.setTimeout(() => setWarm(true), 600); };
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, { once: true });
    return () => { window.removeEventListener('load', later); clearTimeout(timer); };
  }, []);

  const go = (n: number) => {
    setCi((n + SLIDES.length) % SLIDES.length);
    setTick(t => t + 1); // remounts the active dot so its progress animation restarts
  };

  return (
    <section className="hero">
      <div
        className={'slider' + (paused ? ' pause' : '')}
        id="sl"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured MAQ favourites"
        // pause on mouse hover only: on a phone a tap would otherwise stop the slideshow for good
        onPointerEnter={e => { if (e.pointerType === 'mouse') setPaused(true); }}
        onPointerLeave={e => { if (e.pointerType === 'mouse') setPaused(false); }}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(ci + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(ci - 1); }
        }}
        // Swipe left/right to change slide. CSS sets touch-action: pan-y on #sl, so the phone keeps
        // vertical scrolling but hands sideways swipes to us instead of cancelling the pointer.
        onPointerDown={e => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          swipe.current = { x: e.clientX, y: e.clientY };
          swiped.current = false;
        }}
        onPointerUp={e => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x, dy = e.clientY - s.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            swiped.current = true;
            go(ci + (dx < 0 ? 1 : -1));
          }
        }}
        onPointerCancel={() => { swipe.current = null; }}
        // a swipe that ends on the slide's link must not also open it
        onClickCapture={e => {
          if (swiped.current) { e.preventDefault(); e.stopPropagation(); swiped.current = false; }
        }}
      >
        {SLIDES.map((s, i) => (
          <article className={'slide ' + s.cls + (i === ci ? ' on' : '')} aria-label={s.name} key={s.cls}>
            {(i === 0 || i === ci || warm) && (
              <Pic
                className="hero-banner"
                src={s.img}
                alt={s.alt}
                sizes="(max-width: 1500px) 100vw, 1500px"
                quality={70}
                preload={i === 0}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            )}
            <div className="tx">
              <p className="k">{s.kicker}</p>
              <BigText text={s.big} />
              <p className="bl">{s.body}<br /><Link href={s.href}>{s.cta}</Link></p>
            </div>
            {s.cls === 's2' && (
              <div className="sps" id="sps" aria-hidden="true">
                {SPARKLES.map((st, k) => <i className="sp" style={st} key={k} />)}
              </div>
            )}
          </article>
        ))}
        <button className="nv p" aria-label="Previous slide" onClick={() => go(ci - 1)}>‹</button>
        <button className="nv n" aria-label="Next slide" onClick={() => go(ci + 1)}>›</button>
        <div
          className="dots"
          id="dots"
          onAnimationEnd={e => {
            if (e.animationName === 'fill' && !reduced.current) go(ci + 1);
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={i === ci ? `on-${tick}` : `d-${i}`}
              type="button"
              title={s.name}
              aria-label={'Show ' + s.name}
              className={i === ci ? 'on' : undefined}
              aria-current={i === ci ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
