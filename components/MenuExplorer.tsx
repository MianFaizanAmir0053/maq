'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CATEGORIES, POPULAR_ITEMS, categoryById, categoryHref,
  type Category, type MenuItem,
} from '@/lib/menu';
import CategoryNav from './CategoryNav';
import { focusMenuSearch } from './Header';
import MenuRow from './MenuRow';
import Pic from './Pic';
import ProductCard from './ProductCard';
import ProductTrack from './ProductTrack';
import { SearchIcon } from './icons';

const longTitle = (c: Category) => (c.title.length > 12 ? ' bn-long' : '');
const cards = (c: Category) => c.items.filter(it => it.page);
const rows = (c: Category) => c.items.filter(it => !it.page);

/* ------------------------------------------------------------------ */
/* Home page: popular picks, category index, full menu and search      */
/* ------------------------------------------------------------------ */

export function HomeMenu() {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);
  const v = query.trim().toLowerCase();
  const searching = !!v;
  const match = (it: MenuItem) => !v || it.search.includes(v);

  const result = (() => {
    const popular = POPULAR_ITEMS.filter(match);
    const seen = new Set<string>();
    let any = popular.length > 0;
    CATEGORIES.forEach(c => c.items.forEach(it => { if (match(it)) { seen.add(it.slug); any = true; } }));
    popular.forEach(it => seen.add(it.slug));
    return { popular: popular.length, count: seen.size, any };
  })();

  // The header's "Find food" link lands here as /#find.
  useEffect(() => {
    if (location.hash === '#find') {
      history.replaceState(null, '', '/#menu');
      requestAnimationFrame(() => focusMenuSearch());
    }
  }, []);

  const photo = CATEGORIES.filter(c => c.photo), board = CATEGORIES.filter(c => !c.photo);
  const boardEmpty = board.every(c => !c.items.some(match));
  const clear = () => setQuery('');

  return (
    <>
      <CategoryNav active="popular" onPick={() => { if (query) clear(); }} />

      <div className="srch">
        <SearchIcon />
        <input
          id="q"
          type="search"
          placeholder="Search burgers, chicken, pizza…"
          aria-label="Search the menu"
          autoComplete="off"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          aria-label="Search"
          id="qb"
          onClick={() => document.getElementById('menu')?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',
          })}
        >→</button>
      </div>

      <div className={'wrap menu' + (searching ? ' is-searching' : '') + (all ? ' all-products' : '')} id="menu" tabIndex={-1}>
        <div className="menu-intro">
          <div className="menu-heading">
            <span className="menu-eyebrow">THE MENU</span>
            <h2>{searching ? 'Search results' : 'Popular picks'}</h2>
          </div>
          <button id="view-mode" type="button" aria-pressed={all} onClick={() => setAll(a => !a)}>
            <span>{all ? 'Use sliders' : 'View all'}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" />
            </svg>
          </button>
        </div>
        <div className="search-feedback" hidden={!searching}>
          <p id="result-status" role="status" aria-live="polite">
            {searching ? result.count + ' matching ' + (result.count === 1 ? 'dish' : 'dishes') : ''}
          </p>
          <button
            id="clear-search"
            type="button"
            hidden={!searching}
            onClick={() => { clear(); document.getElementById('q')?.focus(); }}
          >Clear search</button>
        </div>

        <div className="blk" id="popular" hidden={result.popular === 0}>
          <div className="ph2">
            <span className="fl" aria-hidden="true">✦</span>
            <div><h3>Popular Items</h3><small>Most ordered right now</small></div>
          </div>
          <ProductTrack id="popular-grid" name="Popular Items" hidden={result.popular === 0} resetKey={v}>
            {POPULAR_ITEMS.map(it => <ProductCard key={it.slug} item={it} withDesc={false} hidden={!match(it)} />)}
          </ProductTrack>
        </div>

        <CategoryIndex />

        <div id="cats-list">
          {photo.map(c => {
            const shown = cards(c).filter(match), shownRows = rows(c).filter(match);
            return (
              <section className="msec" id={c.id} data-cat={c.id} key={c.id}>
                <div
                  className={'bn' + longTitle(c)}
                  data-cat={c.id}
                  hidden={!shown.length && !shownRows.length}
                  style={{ backgroundImage: `url('${c.banner}')` }}
                >
                  <div className="bt"><h2 className="d">{c.title}</h2><span className="sp2">{c.tagline || c.meta}</span></div>
                  <Link className="category-banner-link" href={categoryHref(c.id)} aria-label={'Explore ' + c.title}></Link>
                </div>
                <ProductTrack id={'track-' + c.id} name={c.title} hidden={!shown.length} resetKey={v}>
                  {cards(c).map(it => <ProductCard key={it.slug} item={it} hidden={!match(it)} />)}
                </ProductTrack>
                {rows(c).length > 0 && (
                  <ul className="mrows mrows-x" hidden={!shownRows.length}>
                    {rows(c).map(it => <MenuRow key={it.slug} item={it} hidden={!match(it)} />)}
                  </ul>
                )}
              </section>
            );
          })}

          <div className="board">
            <div className="board-head" hidden={boardEmpty}>
              <span className="eyebrow-l">More from the kitchen</span>
              <h2 className="vh2">Kebabs, sides &amp; extras</h2>
            </div>
            <div className="board-cols">
              {board.map(c => (
                <section
                  className={'msec mpanel' + (c.items.some(match) ? '' : ' is-empty')}
                  id={c.id}
                  data-cat={c.id}
                  key={c.id}
                >
                  <BoardBanner c={c} />
                  <h3 className="mp-h"><Link href={categoryHref(c.id)}>{c.title}</Link></h3>
                  <ul className="mrows">
                    {c.items.map(it => <MenuRow key={it.slug} item={it} hidden={!match(it)} />)}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>

        <p className="none" id="none" hidden={result.any}>
          No dishes found. Try “chicken”, “pizza” or clear your search to browse everything.
        </p>
        <p className="menu-note">
          Menu browsing only · Food photography is illustrative. Please confirm availability and dietary requirements with the team.
        </p>
      </div>
    </>
  );
}

function BoardBanner({ c, route }: { c: Category; route?: boolean }) {
  return (
    <div
      className={'bn bn-text' + longTitle(c) + (route ? ' route-banner' : '') + (c.thumb ? ' bn-pic' : '')}
      data-cat={c.id}
      style={c.thumb ? ({ '--bn-img': `url('${c.thumb}')` } as React.CSSProperties) : undefined}
    >
      <div className="bt"><h2 className="d">{c.title}</h2><span className="sp2">{c.meta}</span></div>
    </div>
  );
}

/** The bento of all categories on the home page. */
function CategoryIndex() {
  return (
    <section className="cindex" id="categories" aria-labelledby="ci-title">
      <div className="ci-head">
        <div><span className="eyebrow-l">The full menu</span><h2 className="vh2" id="ci-title">Browse by category</h2></div>
        <p>{CATEGORIES.length} categories</p>
      </div>
      <ul className="ci-grid">
        {CATEGORIES.map(c => c.tile ? (
          <li className="ci-photo" key={c.id}>
            <Link href={categoryHref(c.id)}>
              <Pic src={c.thumb!} alt="" sizes="(max-width: 700px) 100vw, 40vw" />
              <span className="ci-tx"><b>{c.title}</b><small>{c.meta}</small></span>
            </Link>
          </li>
        ) : (
          <li className="ci-text" key={c.id}>
            <Link href={categoryHref(c.id)}>
              <span className="ci-tx"><b>{c.title}</b><small>{c.meta}</small></span>
              <span className="ci-go" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Category page: one category, its banner, the tabs and every dish     */
/* ------------------------------------------------------------------ */

export function CategoryMenu({ id }: { id: string }) {
  const c = categoryById(id)!;
  const nav = <CategoryNav active={c.id} back />;

  return (
    <div className="wrap menu" id="menu" tabIndex={-1}>
      <div id="cats-list">
        {c.photo ? (
          <section className="msec route-sec" id={c.id} data-cat={c.id}>
            <div className={'bn route-banner' + longTitle(c)} data-cat={c.id} style={{ backgroundImage: `url('${c.banner}')` }}>
              <div className="bt"><h2 className="d">{c.title}</h2><span className="sp2">{c.tagline || c.meta}</span></div>
            </div>
            {nav}
            <ProductTrack id={'track-' + c.id} name={c.title} className="route-products">
              {cards(c).map((it, i) => <ProductCard key={it.slug} item={it} order={Math.min(i, 8)} />)}
            </ProductTrack>
            {rows(c).length > 0 && (
              <ul className="mrows mrows-x">{rows(c).map(it => <MenuRow key={it.slug} item={it} />)}</ul>
            )}
          </section>
        ) : (
          <div className="board">
            <div className="board-cols">
              <section className="msec mpanel route-sec" id={c.id} data-cat={c.id}>
                <BoardBanner c={c} route />
                {nav}
                <ul className="mrows">{c.items.map(it => <MenuRow key={it.slug} item={it} />)}</ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
