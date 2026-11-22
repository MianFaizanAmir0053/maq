import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Pic from '@/components/Pic';
import SizePicker from '@/components/SizePicker';
import {
  PRODUCTS, categoryById, categoryHref, fromText, itemHref, money, productBySlug,
} from '@/lib/menu';
import { DEFAULT_OG_IMAGE, OG } from '@/lib/schema';
import { SITE } from '@/lib/site';

type Props = { params: Promise<{ category: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ category: p.catId, item: p.slug }));
}

async function load(params: Props['params']) {
  const { category, item } = await params;
  const p = productBySlug(item);
  if (!p || p.catId !== category) return null;
  return { p, c: categoryById(category)! };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { p, c } = found;
  return {
    title: `${p.name} (${c.title})`,
    description: `${p.name}, ${p.priceText}, at MAQ Burgers in ${SITE.area}. ${p.desc ?? ''}`.trim(),
    alternates: { canonical: itemHref(p) },
    openGraph: { ...OG, images: [p.img ?? DEFAULT_OG_IMAGE] },
  };
}

export default async function ProductPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const { p, c } = found;

  const same = PRODUCTS.filter(x => x.catId === c.id);
  const i = same.indexOf(p);
  const prev = same[(i - 1 + same.length) % same.length];
  const next = same[(i + 1) % same.length];
  const related = [...same.filter(x => x !== p), ...PRODUCTS.filter(x => x.catId !== c.id)].slice(0, 4);

  return (
    <main id="main" className="page-view" tabIndex={-1}>
      <section className="view" id="view-item" aria-labelledby="item-name">
        <div className="wrap ip">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/#menu">Menu</Link><span aria-hidden="true">/</span>
            <Link href={categoryHref(c.id)}>{c.title}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{p.name}</span>
          </nav>
          <div className="ip-grid">
            <div className="ip-media">
              <Pic src={p.img!} alt={p.name} preload sizes="(max-width: 900px) 100vw, 50vw" />
              {p.badge && <span className="ip-badge">{p.badge}</span>}
            </div>
            <div className="ip-tx">
              <span className="eyebrow-l">{c.title}</span>
              <h1 className="vh1" id="item-name" tabIndex={-1}>{p.name}</h1>
              {c.tagline && <span className="ip-tag">{c.tagline}</span>}
              {p.desc && <p className="ip-desc">{p.desc}</p>}
              {p.sized
                ? <SizePicker single={p.single!} double={p.double!} />
                : <div className="ip-price"><b>{money(p.price!)}</b></div>}
              <ul className="ip-notes">
                <li>For ingredient or allergy questions, please check with the team before ordering.</li>
              </ul>
              <div className="ip-actions">
                <Link className="vcta" href={{ pathname: '/contact', query: { dish: p.name } }}>
                  Ask about this dish <span aria-hidden="true">→</span>
                </Link>
                <Link className="vghost" href={categoryHref(c.id)}>All {c.short.toLowerCase()}</Link>
              </div>
            </div>
          </div>

          {same.length > 1 && (
            <nav className="ip-pager" aria-label={'More ' + c.title}>
              {same.length > 2 && (
                <Link href={itemHref(prev)}><small>← Previous</small><span>{prev.name}</span></Link>
              )}
              <Link href={itemHref(next)}><small>Next →</small><span>{next.name}</span></Link>
            </nav>
          )}

          <div className="vsec">
            <div className="vhead"><span className="eyebrow-l">You might also like</span><h2 className="vh2">More from MAQ</h2></div>
            <ul className="rel">
              {related.map(x => (
                <li key={x.slug}>
                  <Link href={itemHref(x)}>
                    <div className="ph"><Pic src={x.img!} alt="" sizes="(max-width: 700px) 50vw, 300px" /></div>
                    <div className="rt"><b>{x.name}</b><i>{fromText(x)}</i></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
