'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, MENU_NOTE, categoryHref } from '@/lib/menu';
import { CloseIcon, GridIcon } from './icons';

type Props = {
  /** 'popular' on the home page, otherwise the category id */
  active: string;
  /** shows the "Full menu" back link (category pages) */
  back?: boolean;
  /** called when a tab is chosen, so the home page can clear its search */
  onPick?: () => void;
};

export default function CategoryNav({ active, back = false, onPick }: Props) {
  const row = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Keep the active tab in view, and fade the edges that have more tabs behind them.
  useEffect(() => {
    const r = row.current!;
    const fades = () => {
      const max = r.scrollWidth - r.clientWidth;
      r.classList.toggle('fade-l', max > 2 && r.scrollLeft > 2);
      r.classList.toggle('fade-r', max > 2 && r.scrollLeft < max - 2);
    };
    const a = r.querySelector<HTMLElement>('a.on');
    if (a && r.scrollWidth > r.clientWidth) {
      r.scrollTo({ left: a.offsetLeft - r.offsetLeft - (r.clientWidth - a.offsetWidth) / 2, behavior: 'instant' });
    }
    fades();
    r.addEventListener('scroll', fades, { passive: true });
    addEventListener('resize', fades);
    addEventListener('load', fades);
    return () => {
      r.removeEventListener('scroll', fades);
      removeEventListener('resize', fades);
      removeEventListener('load', fades);
    };
  }, [active]);

  const openSheet = () => {
    sheet.current?.showModal();
    document.documentElement.style.overflow = 'hidden';
    setSheetOpen(true);
  };
  const closeSheet = () => {
    document.documentElement.style.overflow = '';
    if (sheet.current?.open) sheet.current.close();
  };

  const tab = (id: string, href: string, label: React.ReactNode, key: string) => {
    const on = active === id;
    return (
      <Link key={key} href={href} data-tab={id} className={on ? 'on' : undefined} aria-current={on ? 'page' : undefined} onClick={onPick}>
        {label}
      </Link>
    );
  };

  return (
    <div className="cats" id="cats">
      {back && (
        <Link className="category-back" href="/#menu" aria-label="Back to the full menu">
          <span className="cb-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </span>
          <span className="cb-lbl">Full menu</span>
        </Link>
      )}
      <button type="button" className="call" aria-haspopup="dialog" aria-controls="catsheet" aria-expanded={sheetOpen} onClick={openSheet}>
        <GridIcon />
        <span>All <em>{CATEGORIES.length}</em></span>
      </button>
      <div className="catrow" id="catrow" ref={row}>
        {tab('popular', '/#popular', 'Popular', 'popular')}
        {CATEGORIES.map(c => tab(c.id, categoryHref(c.id), <>{c.short}<sup>{c.count}</sup></>, c.id))}
      </div>

      <dialog
        className="catsheet"
        id="catsheet"
        aria-labelledby="cs-title"
        ref={sheet}
        onClose={() => { document.documentElement.style.overflow = ''; setSheetOpen(false); }}
        onClick={e => {
          const t = e.target as HTMLElement;
          if (t === sheet.current || t.closest('.cs-close,.cs-grid a')) closeSheet();
        }}
      >
        <div className="cs-in">
          <div className="cs-top">
            <div><span className="eyebrow-l">The full menu</span><h2 id="cs-title">All categories</h2></div>
            <button type="button" className="dr-close cs-close" aria-label="Close categories"><CloseIcon /></button>
          </div>
          <ul className="cs-grid">
            {CATEGORIES.map(c => {
              const on = active === c.id;
              return (
                <li key={c.id}>
                  <Link href={categoryHref(c.id)} data-tab={c.id} className={on ? 'on' : undefined} aria-current={on ? 'page' : undefined} onClick={onPick}>
                    <span className="cs-num">{c.num}</span>
                    <span className="cs-tx"><b>{c.title}</b><small>{c.meta}</small></span>
                    <span className="cs-go" aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="cs-note">{MENU_NOTE}</p>
        </div>
      </dialog>
    </div>
  );
}
