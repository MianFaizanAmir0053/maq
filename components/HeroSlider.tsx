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
    cls: 's2', name: 'Southern Fried', img: '/assets/img-07-6c323c24.webp',
    alt: 'Crispy chicken burger with slaw beside golden fried chicken.',
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
    cls: 's4', name: 'Loaded Fries', img: '/assets/img-09-1306451b.webp',
    alt: 'Loaded fries topped with beef, melted cheddar and sauce.',
    kicker: 'Loaded up. Sauced right.', big: 'LOADED|FRIES',
    body: 'French fries, smashed beef patty with cheese, halal bacon, barbecue sauce and MAQ sauce. $18.00.',
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
  const reduced = useRef(false);
  const touchX = useRef(0);

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion:reduce)').matches;
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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(ci + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(ci - 1); }
        }}
        onPointerDown={e => { touchX.current = e.clientX; }}
        onPointerUp={e => {
          const d = e.clientX - touchX.current;
          if (Math.abs(d) > 50) go(ci + (d < 0 ? 1 : -1));
        }}
      >
        {SLIDES.map((s, i) => (
          <article className={'slide ' + s.cls + (i === ci ? ' on' : '')} aria-label={s.name} key={s.cls}>
            <Pic
              className="hero-banner"
              src={s.img}
              alt={s.alt}
              sizes="100vw"
              preload={i === 0}
            />
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
