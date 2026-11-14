import type { Metadata, Viewport } from 'next';
import { Anton, Cormorant_Garamond, Plus_Jakarta_Sans, Luckiest_Guy } from 'next/font/google';
import Fabs from '@/components/Fabs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { SITE } from '@/lib/site';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton', display: 'swap' });
const cormorant = Cormorant_Garamond({ weight: '500', style: 'italic', subsets: ['latin'], variable: '--font-cormorant', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const luckiest = Luckiest_Guy({ weight: '400', subsets: ['latin'], variable: '--font-luckiest', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'MAQ Burgers — Explore the Menu', template: '%s | MAQ Burgers' },
  description: 'Smash burgers, chicken, pizzas, loaded fries and kebabs — made fresh at MAQ Burgers.',
  openGraph: { siteName: 'MAQ Burgers', type: 'website', images: ['/assets/img-06-6845b64c.webp'] },
  icons: { icon: '/assets/img-05-d6dd3910.jpg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${cormorant.variable} ${jakarta.variable} ${luckiest.variable}`} data-scroll-behavior="smooth">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        {children}
        <Footer />
        <Fabs />
      </body>
    </html>
  );
}
