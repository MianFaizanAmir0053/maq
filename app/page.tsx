import HeroSlider from '@/components/HeroSlider';
import { HomeMenu } from '@/components/MenuExplorer';

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <h1 className="sr-only">MAQ Burgers — explore our menu</h1>
      <HeroSlider />
      <HomeMenu />
    </main>
  );
}
