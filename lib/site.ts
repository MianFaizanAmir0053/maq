/* ===== Site details: edit these and every page updates (header drawer, catering, contact, footer). ===== */
export const SITE = {
  name: 'MAQ Burgers',
  phone: '0421 435 003',
  email: 'maqburgers@gmail.com',
  address: '17B Beechboro Road South, Bayswater WA 6053',
  hours: [
    ['Monday', '11am – 10pm'],
    ['Tuesday', '11am – 10pm'],
    ['Wednesday', '11am – 10pm'],
    ['Thursday', '11am – 10pm'],
    ['Friday', '11am – 11pm'],
    ['Saturday', '11am – 11pm'],
    ['Sunday', '12pm – 10pm'],
  ] as [string, string][], // PLACEHOLDER
  /** Public URL of the deployed site, used for the sitemap and social links. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

/** "0421 435 003" → "tel:+61421435003", so the link dials from any phone */
export const telHref = 'tel:' + SITE.phone.replace(/[^\d+]/g, '').replace(/^0/, '+61');
export const mailHref = 'mailto:' + SITE.email;
export const mapsHref =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('MAQ Burgers ' + SITE.address);
