'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { MENU_GROUPS, categoryHref } from '@/lib/menu';
import { SITE, mailHref, telHref } from '@/lib/site';
import NavMenu from './NavMenu';
import Pic from './Pic';
import { CloseIcon, SearchIcon } from './icons';

const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches;

/** Scrolls to the menu search and focuses it. Returns false when there is no search on this page. */
export function focusMenuSearch() {
  const q = document.getElementById('q') as HTMLInputElement | null;
  if (!q) return false;
  q.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'center' });
  setTimeout(() => q.focus({ preventScroll: true }), 350);
  return true;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const section = pathname.startsWith('/catering') ? 'catering' : pathname.startsWith('/contact') ? 'contact' : pathname === '/' || pathname.startsWith('/menu') ? 'menu' : null;

  // Scrolled state, and the header hides while scrolling down.
  useEffect(() => {
    const el = header.current!;
    let lastY = scrollY, ticking = false;
    const onScroll = () => {
      const y = scrollY, d = y - lastY;
      el.classList.toggle('scrolled', y > 8);
      if (y < 320 || el.contains(document.activeElement)) document.body.classList.remove('hdr-up');
      else if (d > 6) document.body.classList.add('hdr-up');
      else if (d < -6) document.body.classList.remove('hdr-up');
      if (Math.abs(d) > 6 || y < 320) lastY = y;
      ticking = false;
    };
    const listener = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    const show = () => document.body.classList.remove('hdr-up');
    addEventListener('scroll', listener, { passive: true });
    el.addEventListener('focusin', show);
    onScroll();
    return () => { removeEventListener('scroll', listener); el.removeEventListener('focusin', show); };
  }, []);

  // A new page always starts with the header showing.
  useEffect(() => { document.body.classList.remove('hdr-up'); }, [pathname]);

  const openDrawer = () => {
    drawer.current?.showModal();
    document.documentElement.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    document.documentElement.style.overflow = '';
    if (drawer.current?.open) drawer.current.close();
  };
  const onDrawerClose = () => {
    document.documentElement.style.overflow = '';
    opener.current?.focus({ preventScroll: true });
  };

  const findFood = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/' && focusMenuSearch()) return;
    router.push('/#find');
  };

  // "/" jumps to the menu search from anywhere, unless you're typing in a field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input,textarea,select,[contenteditable="true"],dialog[open]')) return;
      e.preventDefault();
      if (pathname === '/' && focusMenuSearch()) return;
      router.push('/#find');
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [pathname, router]);

  const drawerOn = (key: string) => (section === key ? 'on' : undefined);

  return (
    <>
      <header className="site-header nb" ref={header}>
        <div className="nb-shell">
          <div className="nb-bar">
            <Link className="nb-brand" href="/" aria-label="MAQ Burgers home">
              <span className="nb-crest">
                <Pic src="/assets/img-05-d6dd3910.jpg" alt="" preload sizes="80px" quality={75} style={{ height: 'auto' }} />
              </span>
              <span className="nb-word" aria-hidden="true"><b>MAQ</b><i>Burgers</i></span>
            </Link>

            <NavMenu />

            <div className="nb-actions">
              <Link className="nb-search" href="/#find" onClick={findFood} aria-label="Search the menu" aria-keyshortcuts="/">
                <SearchIcon size={15} width={1.7} />
                <span className="nb-search-lbl">Search menu</span>
                <kbd aria-hidden="true">/</kbd>
              </Link>
              <button ref={opener} className="nb-menu" type="button" aria-haspopup="dialog" aria-controls="drawer" aria-label="Open navigation" onClick={openDrawer}>
                <span aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <dialog
        className="drawer"
        id="drawer"
        aria-label="Site navigation"
        ref={drawer}
        onClose={onDrawerClose}
        onClick={e => {
          const t = e.target as HTMLElement;
          if (t === drawer.current || t.closest('a')) closeDrawer();
        }}
      >
        <div className="dr-in">
          <div className="dr-top">
            <span className="dr-eyebrow">MAQ Burgers</span>
            <button type="button" className="dr-close" aria-label="Close navigation" onClick={closeDrawer}><CloseIcon /></button>
          </div>
          <div className="dr-body">
            <nav className="dr-nav" aria-label="Site">
              {([['/#menu', 'menu', 'Our menu'], ['/catering', 'catering', 'Catering'], ['/contact', 'contact', 'Contact']] as const).map(([href, key, label], i) => (
                <Link key={key} href={href} className={drawerOn(key)} aria-current={section === key ? 'page' : undefined}>
                  <small>0{i + 1}</small><span>{label}</span><i aria-hidden="true">→</i>
                </Link>
              ))}
            </nav>
            <nav className="dr-cats" aria-labelledby="dr-cats-title">
              <span className="dr-eyebrow" id="dr-cats-title">Menu categories</span>
              {MENU_GROUPS.map(g => (
                <div className="dr-group" key={g.title}>
                  <span className="dr-gh">{g.title}</span>
                  <ul>
                    {g.cats.map(c => {
                      const on = pathname === categoryHref(c.id) || pathname.startsWith(categoryHref(c.id) + '/');
                      return (
                        <li key={c.id}>
                          <Link href={categoryHref(c.id)} className={on ? 'on' : undefined} aria-current={on ? 'page' : undefined}>
                            <span>{c.title}</span><em aria-label={c.count + (c.count === 1 ? ' item' : ' items')}>{c.count}</em>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="dr-foot">
            <div className="dr-acts">
              <a className="dr-btn dr-btn-p" href={telHref}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                Call us
              </a>
              <a className="dr-btn" href={mailHref}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                Email
              </a>
            </div>
            <p>{SITE.address}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
