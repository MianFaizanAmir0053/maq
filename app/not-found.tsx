import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="page-view" tabIndex={-1}>
      <section className="view" aria-labelledby="nf-title">
        <div className="wrap ip ip-miss">
          <h1 className="vh1" id="nf-title">Not found</h1>
          <p>We couldn’t find that page. The dish may have moved on the menu.</p>
          <Link className="vcta" href="/#menu">Back to the menu</Link>
        </div>
      </section>
    </main>
  );
}
