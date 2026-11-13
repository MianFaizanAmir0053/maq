'use client';

import { useRef, useState } from 'react';
import { money } from '@/lib/menu';

/** Single / Double price toggle on a dish page (an ARIA radio group). */
export default function SizePicker({ single, double }: { single: number; double: number }) {
  const [size, setSize] = useState<'s' | 'd'>('s');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const opts = [
    { key: 's' as const, label: 'Single', amount: single },
    { key: 'd' as const, label: 'Double', amount: double },
  ];
  const current = opts.find(o => o.key === size)!;

  return (
    <>
      <div className="ip-price">
        <small id="ip-size-lbl">{current.label}</small>
        <b id="ip-amount">{money(current.amount)}</b>
      </div>
      <div className="ip-size" role="radiogroup" aria-label="Size">
        {opts.map((o, k) => (
          <button
            key={o.key}
            ref={el => { refs.current[k] = el; }}
            type="button"
            role="radio"
            aria-checked={size === o.key}
            tabIndex={size === o.key ? 0 : -1}
            onClick={() => setSize(o.key)}
            onKeyDown={e => {
              if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
                const n = (k + 1) % 2;
                setSize(opts[n].key);
                refs.current[n]?.focus();
              }
            }}
          >
            {o.label}<span>{money(o.amount)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
