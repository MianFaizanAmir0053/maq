import type { MetadataRoute } from 'next';
import { CATEGORIES, PRODUCTS, categoryHref, itemHref } from '@/lib/menu';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/catering', '/contact', ...CATEGORIES.map(c => categoryHref(c.id)), ...PRODUCTS.map(itemHref)];
  return paths.map(p => ({ url: new URL(p, SITE.url).toString() }));
}
