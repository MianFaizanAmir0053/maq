import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first (smallest), WebP for browsers without AVIF.
    formats: ['image/avif', 'image/webp'],
    // 60 for photos in cards and banners, 70 for the hero, 75 is next/image's default.
    qualities: [60, 70, 75],
    // Phone, tablet and desktop widths; nothing above 1920 (the hero tops out at 1500px wide).
    deviceSizes: [640, 750, 828, 1080, 1280, 1920],
    imageSizes: [96, 128, 256, 384],
    // File names in /public/assets carry a content hash, so optimised copies can be cached for a month.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        // Hashed file names never change content, so browsers may keep them for a year.
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
