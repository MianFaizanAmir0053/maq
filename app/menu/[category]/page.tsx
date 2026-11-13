import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryMenu } from '@/components/MenuExplorer';
import { CATEGORIES, categoryById } from '@/lib/menu';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = categoryById((await params).category);
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.title} at MAQ Burgers: ${c.meta}.${c.tagline ? ' ' + c.tagline : ''}`,
    openGraph: c.banner ? { images: [c.banner] } : undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const c = categoryById((await params).category);
  if (!c) notFound();
  return (
    <main id="main" className="category-page" tabIndex={-1}>
      <h1 className="sr-only">{c.title} — MAQ Burgers menu</h1>
      <CategoryMenu id={c.id} />
    </main>
  );
}
