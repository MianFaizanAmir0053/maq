/* ===== Site details: edit these and every page updates (header drawer, catering, contact, footer). ===== */

/** The shop's address in parts, for search engines (see lib/schema.tsx). */
export const ADDRESS = {
  street: '17B Beechboro Road South',
  suburb: 'Bayswater',
  state: 'WA',
  postcode: '6053',
  country: 'AU',
};

export const SITE = {
  name: 'MAQ Burgers',
  phone: '0421 435 003',
  email: 'maqburgers@gmail.com',
  address: `${ADDRESS.street}, ${ADDRESS.suburb} ${ADDRESS.state} ${ADDRESS.postcode}`,
  /** Where the shop is, as people search for it. Used in page titles and descriptions. */
  area: 'Bayswater, Perth',
  /** Public URL of the deployed site, used for the sitemap, canonical links and social links. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maqburgers.com.au',
};

/** "0421 435 003" → "+61421435003" */
export const phoneIntl = SITE.phone.replace(/[^\d+]/g, '').replace(/^0/, '+61');
/** "0421 435 003" → "tel:+61421435003", so the link dials from any phone */
export const telHref = 'tel:' + phoneIntl;
export const mailHref = 'mailto:' + SITE.email;
export const mapsHref =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('MAQ Burgers ' + SITE.address);
