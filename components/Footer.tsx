import Link from 'next/link';
import { CATEGORIES, categoryHref } from '@/lib/menu';
import { SITE, mailHref, mapsHref, telHref } from '@/lib/site';
import Pic from './Pic';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap sf-grid">
        <div className="sf-brand">
          <Link className="sf-crest" href="/" aria-label="MAQ Burgers home">
            <Pic src="/assets/img-05-d6dd3910.jpg" alt="" sizes="200px" quality={75} style={{ height: 'auto' }} />
          </Link>
          <p>Smash burgers, crispy chicken, hot pizzas and loaded fries, made fresh.</p>
        </div>
        <nav className="sf-col sf-menu" aria-label="Menu">
          <h2>Menu</h2>
          {CATEGORIES.slice(0, 6).map(c => (
            <Link key={c.id} href={categoryHref(c.id)}>{c.title}</Link>
          ))}
          <Link href="/#categories">All {CATEGORIES.length} categories →</Link>
        </nav>
        <nav className="sf-col" aria-label="Company">
          <h2>MAQ</h2>
          <Link href="/catering">Catering</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/#menu">Full menu</Link>
        </nav>
        <div className="sf-col">
          <h2>Visit</h2>
          <p>{SITE.address}</p>
          <a href={mapsHref} target="_blank" rel="noopener">Get directions ↗</a>
          <p className="sf-contact"><span>Call</span><a href={telHref}>{SITE.phone}</a></p>
          <p className="sf-contact"><span>Email</span><a href={mailHref}>{SITE.email}</a></p>
        </div>
      </div>
      <div className="wrap sf-copy">
        <span>© {new Date().getFullYear()} MAQ Burgers</span>
      </div>
    </footer>
  );
}
