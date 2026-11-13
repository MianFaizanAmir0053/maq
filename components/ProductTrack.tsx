'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Chevron } from './icons';

type Props = {
  id: string;
  /** used for the region and button labels, e.g. "Pizzas" */
  name: string;
  className?: string;
  hidden?: boolean;
  /** changing this scrolls the track back to the start (e.g. the search text) */
  resetKey?: string;
  children: ReactNode;
};

type State = { show: boolean; atStart: boolean; atEnd: boolean; progress: number; count: string };

/** A horizontally scrolling row of cards with previous/next buttons, progress and mouse drag. */
export default function ProductTrack({ id, name, className = '', hidden, resetKey, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [st, setSt] = useState<State>({ show: false, atStart: true, atEnd: false, progress: 0, count: '' });
  const reduced = useRef(false);

  const visible = () => [...(track.current?.children ?? [])].filter(c => !(c as HTMLElement).hidden) as HTMLElement[];

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const items = visible();
    const max = t.scrollWidth - t.clientWidth;
    const pos = (c: HTMLElement) => Math.abs(c.offsetLeft - t.offsetLeft - t.scrollLeft);
    const active = items.reduce((n, c, k) => (pos(c) < pos(items[n]) ? k : n), 0);
    setSt({
      show: !t.hidden && max > 3,
      atStart: t.scrollLeft < 3,
      atEnd: t.scrollLeft >= max - 3,
      progress: max > 0 ? Math.min(100, Math.max(0, (t.scrollLeft / max) * 100)) : 100,
      count: items.length ? String(active + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0') : '',
    });
  }, []);

  const move = (direction: number) => {
    const t = track.current, card = visible()[0];
    if (!t || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(t).gap || '0');
    t.scrollBy({ left: direction * step, behavior: reduced.current ? 'instant' : 'smooth' });
  };

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = track.current!;
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { update(); pending = false; });
    };
    t.addEventListener('scroll', onScroll, { passive: true });

    // Mouse drag supplements native touch and trackpad scrolling.
    let start: { x: number; y: number; left: number; id: number } | null = null, dragged = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || (e.target as HTMLElement).closest('button,a')) return;
      start = { x: e.clientX, y: e.clientY, left: t.scrollLeft, id: e.pointerId };
      dragged = false;
    };
    const moveP = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (!dragged && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
        dragged = true;
        t.classList.add('is-dragging');
        t.setPointerCapture(e.pointerId);
      }
      if (dragged) { e.preventDefault(); t.scrollLeft = start.left - dx; }
    };
    const finish = () => {
      if (!start) return;
      const pid = start.id;
      start = null;
      t.classList.remove('is-dragging');
      if (t.hasPointerCapture(pid)) t.releasePointerCapture(pid);
      update();
    };
    const leave = () => { if (!dragged) start = null; };
    // a drag must not also count as a click on the card under the pointer
    const click = (e: MouseEvent) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } };
    t.addEventListener('pointerdown', down);
    t.addEventListener('pointermove', moveP);
    t.addEventListener('pointerup', finish);
    t.addEventListener('pointercancel', finish);
    t.addEventListener('lostpointercapture', finish);
    t.addEventListener('pointerleave', leave);
    t.addEventListener('click', click, true);
    const ro = new ResizeObserver(update);
    ro.observe(t);
    update();
    return () => {
      t.removeEventListener('scroll', onScroll);
      t.removeEventListener('pointerdown', down);
      t.removeEventListener('pointermove', moveP);
      t.removeEventListener('pointerup', finish);
      t.removeEventListener('pointercancel', finish);
      t.removeEventListener('lostpointercapture', finish);
      t.removeEventListener('pointerleave', leave);
      t.removeEventListener('click', click, true);
      ro.disconnect();
    };
  }, [update]);

  // New search results start from the first card.
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    t.scrollLeft = 0;
    requestAnimationFrame(update);
  }, [resetKey, hidden, update]);

  return (
    <>
      <div
        ref={track}
        id={id}
        className={('grid product-track ' + className).trim()}
        role="region"
        aria-label={name + ' products'}
        tabIndex={0}
        hidden={hidden}
        onKeyDown={e => {
          if (e.target !== track.current) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            move(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
      <div className="product-controls" hidden={!st.show}>
        <div className="product-progress" aria-hidden="true">
          <span style={{ '--progress': st.progress + '%' } as CSSProperties}></span>
        </div>
        <div className="product-buttons">
          <span className="product-count" aria-live="polite">{st.count}</span>
          <button type="button" aria-label={'Previous ' + name} aria-controls={id} disabled={st.atStart} onClick={() => move(-1)}><Chevron dir={-1} /></button>
          <button type="button" aria-label={'Next ' + name} aria-controls={id} disabled={st.atEnd} onClick={() => move(1)}><Chevron dir={1} /></button>
        </div>
      </div>
    </>
  );
}
