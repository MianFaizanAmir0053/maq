import { ADDRESS, SITE, phoneIntl } from './site';

const abs = (path: string) => new URL(path, SITE.url).toString();

/**
 * Open Graph fields every page shares. A page that sets its own openGraph replaces the
 * layout's whole object, so spread this in: { openGraph: { ...OG, images: [...] } }.
 */
export const OG = { siteName: SITE.name, type: 'website', locale: 'en_AU' } as const;
/** Share image for pages without a photo of their own. */
export const DEFAULT_OG_IMAGE = '/assets/img-35-b46ed744.webp';

/**
 * The shop as a schema.org Restaurant, so Google, Bing and others can show its address,
 * phone and menu link in results and match it to the Google Business Profile.
 * Rendered on the home page (app/page.tsx).
 */
export const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': abs('/#restaurant'),
  name: SITE.name,
  url: abs('/'),
  logo: abs('/assets/img-05-d6dd3910.jpg'),
  image: [abs('/assets/img-35-b46ed744.webp'), abs('/assets/img-08-78704772.webp'), abs('/assets/img-39-cdc35d60.webp')],
  telephone: phoneIntl,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.suburb,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.postcode,
    addressCountry: ADDRESS.country,
  },
  areaServed: 'Perth, Western Australia',
  servesCuisine: ['Burgers', 'Fried chicken', 'Pizza', 'Kebabs', 'Fast food'],
  priceRange: '$',
  currenciesAccepted: 'AUD',
  hasMenu: abs('/#menu'),
  acceptsReservations: false,
};

/** A JSON-LD <script>. "<" is escaped so no value can close the tag early. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
  );
}
