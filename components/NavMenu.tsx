'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CATEGORIES, MENU_GROUPS, categoryHref } from '@/lib/menu';
import { SITE, mapsHref, telHref } from '@/lib/site';
import Pic from './Pic';

type Key = 'home' | 'menu' | 'catering' | 'contact';
type Child = { href: string; title: string; desc: string; external?: boolean; accent?: boolean };

const CATERING: Child[] = [
  { href: '/catering#how-it-works', title: 'How it works', desc: 'Three steps from enquiry to event' },
  { href: '/catering#occasions', title: 'Perfect for', desc: 'Offices, parties, clubs and more' },
  { href: '/catering#enquiry', title: 'Start an enquiry', desc: 'Get a tailored menu and a quote', accent: true },
];
const CONTACT: Child[] = [
  { href: '/contact#message', title: 'Send a message', desc: 'Menu, allergens or big orders' },
  { href: '/contact#hours', title: 'Opening hours', desc: 'Lunch and dinner, seven days' },
  { href: mapsHref, title: 'Get directions', desc: SITE.address, external: true },
  { href: telHref, title: 'Call us', desc: SITE.phone, accent: true },
];

function sectionOf(pathname: string): Key | null {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/menu')) return 'menu';
  if (pathname.startsWith('/catering')) return 'catering';
  if (pathname.startsWith('/contact')) return 'contact';
  return null;
}

const Caret = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4.5L6 7.5l3-3" /></svg>
);

function ChildList({ items }: { items: Child[] }) {
  return (
    <ul className="nb-list">
      {items.map((c, i) => (
        <li key={c.title} style={{ '--i': i } as React.CSSProperties}>
          {c.href.startsWith('/') ? (
            <Link href={c.href} className={c.accent ? 'acc' : undefined}>
              <span className="nb-lt">{c.title}</span>
              <small>{c.desc}</small>
              <i aria-hidden="true">→</i>
            </Link>
          ) : (
            <a href={c.href} className={c.accent ? 'acc' : undefined} {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}>
              <span className="nb-lt">{c.title}{c.external && <span aria-hidden="true"> ↗</span>}</span>
              <small>{c.desc}</small>
              <i aria-hidden="true">→</i>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function MenuMega() {
  let n = 0;
  return (
    <div className="nb-mega">
      <div className="nb-groups">
        {MENU_GROUPS.map(g => (
          <div className="nb-group" key={g.title}>
            <span className="nb-gh">{g.title}</span>
            <ul>
              {g.cats.map(c => (
                <li key={c.id} style={{ '--i': n++ } as React.CSSProperties}>
                  <Link href={categoryHref(c.id)}>
                    <span className="nb-ct">{c.title}</span>
                    <em>{c.count}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <aside className="nb-feature">
        <Link href="/#popular" className="nb-feat-card">
          <span className="nb-feat-img"><Pic src="/assets/img-18-7ad74c50.jpg" alt="" sizes="260px" /></span>
          <span className="nb-feat-tx">
            <small>Most ordered</small>
            <b>Popular picks</b>
            <span>From the MAQ Classic to Peri Peri pizza.</span>
          </span>
        </Link>
        <Link href="/#categories" className="nb-feat-all">
          <span>All {CATEGORIES.length} categories</span><i aria-hidden="true">→</i>
        </Link>
      </aside>
    </div>
  );
}

const ITEMS: { key: Key; href: string; label: string; panel?: ReactNode; wide?: boolean }[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'menu', href: '/#menu', label: 'Menu', panel: <MenuMega />, wide: true },
  { key: 'catering', href: '/catering', label: 'Catering', panel: <ChildList items={CATERING} /> },
  { key: 'contact', href: '/contact', label: 'Contact', panel: <ChildList items={CONTACT} /> },
];

/** The navbar's main links: a sliding highlight, and dropdowns that open on hover or with the caret button. */
export default function NavMenu() {
  const pathname = usePathname();
  const section = sectionOf(pathname);
  const nav = useRef<HTMLElement>(null);
  const glide = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState<Key | null>(null);

  /* --- sliding highlight --- */
  const moveGlide = (to: HTMLElement | null | undefined) => {
    const g = glide.current;
    if (!g) return;
    // the item under the pill gets dark text. Kept on the nav as data-lit (not a class on the item)
    // because React re-renders the items' className whenever a dropdown opens.
    if (nav.current) nav.current.dataset.lit = to?.dataset.k ?? '';
    if (!to) { g.style.opacity = '0'; return; }
    g.style.opacity = '1';
    g.style.setProperty('--gx', to.offsetLeft + 'px');
    g.style.setProperty('--gw', to.offsetWidth + 'px');
  };
  const itemEl = (k: Key | null) => (k ? nav.current?.querySelector<HTMLElement>(`[data-k="${k}"]`) : null);

  useEffect(() => {
    const g = glide.current, n = nav.current;
    if (!g || !n) return;
    moveGlide(itemEl(section));
    const id = requestAnimationFrame(() => g.classList.add('ready'));
    const ro = new ResizeObserver(() => moveGlide(itemEl(section)));
    ro.observe(n);
    document.fonts?.ready.then(() => moveGlide(itemEl(section)));
    return () => { cancelAnimationFrame(id); ro.disconnect(); };
  }, [section]);

  /* --- dropdowns: small delays so a pointer can travel from the link into the panel --- */
  const openSoon = (k: Key) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(k), open ? 0 : 110);
  };
  const closeSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), 220);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // a tap or click anywhere else closes an open dropdown
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!nav.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  return (
    <nav
      className="nb-links"
      aria-label="Main"
      ref={nav}
      onPointerLeave={() => { closeSoon(); moveGlide(itemEl(section)); }}
      onClick={e => { if ((e.target as HTMLElement).closest('a')) setOpen(null); }}
      onKeyDown={e => {
        if (e.key === 'Escape' && open) {
          const k = open;
          setOpen(null);
          itemEl(k)?.querySelector<HTMLElement>('.nb-caret')?.focus();
        }
      }}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) { setOpen(null); moveGlide(itemEl(section)); }
      }}
    >
      <span className="nb-glide" ref={glide} aria-hidden="true" />
      {ITEMS.map(it => {
        const on = section === it.key;
        const isOpen = open === it.key;
        const panelId = 'nb-pop-' + it.key;
        return (
          <div
            key={it.key}
            data-k={it.key}
            className={'nb-item' + (on ? ' on' : '') + (isOpen ? ' open' : '') + (it.panel ? ' has-pop' : '')}
            onPointerEnter={e => {
              moveGlide(e.currentTarget);
              if (it.panel && e.pointerType === 'mouse') openSoon(it.key);
              else if (!it.panel) closeSoon();
            }}
          >
            <Link
              href={it.href}
              className={on ? 'on' : undefined}
              aria-current={on ? 'page' : undefined}
              onFocus={e => moveGlide(e.currentTarget.parentElement)}
            >
              <span className="nb-roll">
                <span>{it.label}</span>
                <span aria-hidden="true">{it.label}</span>
              </span>
            </Link>
            {it.panel && (
              <>
                <button
                  type="button"
                  className="nb-caret"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`${it.label} pages`}
                  onClick={() => { window.clearTimeout(timer.current); setOpen(isOpen ? null : it.key); }}
                >
                  <Caret />
                </button>
                <div
                  className={'nb-pop' + (it.wide ? ' wide' : '')}
                  id={panelId}
                  onPointerEnter={() => window.clearTimeout(timer.current)}
                >
                  {it.panel}
                </div>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
