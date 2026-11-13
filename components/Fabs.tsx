'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { focusMenuSearch } from './Header';
import { SearchIcon } from './icons';

/** Floating buttons: search (home page) and back to top. */
export default function Fabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [up, setUp] = useState(false);

  useEffect(() => {
    const onScroll = () => setUp(scrollY > 600);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {pathname === '/' && (
        <button className="fab l" id="fs" aria-label="Search" onClick={() => { if (!focusMenuSearch()) router.push('/#find'); }}>
          <SearchIcon />
        </button>
      )}
      <button
        className={'fab r' + (up ? ' on' : '')}
        id="up"
        aria-label="Back to top"
        onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
      </button>
    </>
  );
}
