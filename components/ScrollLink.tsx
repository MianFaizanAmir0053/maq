'use client';

import type { ReactNode } from 'react';

/** Scrolls to an element on the same page and focuses its first field, without changing the URL. */
export default function ScrollLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href={'#' + to}
      onClick={e => {
        const t = document.getElementById(to);
        if (!t) return;
        e.preventDefault();
        const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
        t.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
        setTimeout(() => t.querySelector<HTMLElement>('input,select,textarea')?.focus({ preventScroll: true }), reduced ? 0 : 600);
      }}
    >
      {children}
    </a>
  );
}
