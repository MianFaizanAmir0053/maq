import type { Metadata } from 'next';
import CateringFeature from '@/components/CateringFeature';
import HeroSlider from '@/components/HeroSlider';
import { HomeMenu } from '@/components/MenuExplorer';
import { JsonLd, restaurantJsonLd } from '@/lib/schema';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <JsonLd data={restaurantJsonLd} />
      <h1 className="sr-only">MAQ Burgers: smash burgers, pizza and kebabs in {SITE.area}</h1>
      <HeroSlider />
      <CateringFeature />
      <HomeMenu />
    </main>
  );
}
