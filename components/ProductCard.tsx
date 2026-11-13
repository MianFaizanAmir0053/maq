'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import { itemHref, money, type MenuItem } from '@/lib/menu';
import Pic from './Pic';

type Props = { item: MenuItem; withDesc?: boolean; hidden?: boolean; order?: number };

/** A dish card. The whole card opens the dish's page; the ↗ link is the keyboard and screen-reader route. */
export default function ProductCard({ item, withDesc = true, hidden, order }: Props) {
  const router = useRouter();
  const href = itemHref(item);
  return (
    <article
      className="pc"
      data-slug={item.slug}
      hidden={hidden}
      style={order != null ? ({ '--card-order': order } as CSSProperties) : undefined}
      onClick={e => {
        if (!(e.target as HTMLElement).closest('a,button')) router.push(href);
      }}
    >
      <div className="ph">
        <Pic
          src={item.img!}
          alt={item.name}
          sizes="(max-width: 700px) 72vw, 360px"
          // the first cards on a category page are above the fold
          loading={order != null && order < 4 ? 'eager' : undefined}
        />
        {item.badge && <em className="bd">{item.badge}</em>}
        <div className="pt">
          {item.sized ? <><small>From</small> {money(item.single!)}</> : money(item.price!)}
        </div>
        <Link className="add" href={href} aria-label={'View ' + item.name}>↗</Link>
      </div>
      <b>{item.name}</b>
      {withDesc && item.desc && <p>{item.desc}</p>}
      <span className="sr-only"> {item.catTitle}</span>
    </article>
  );
}
