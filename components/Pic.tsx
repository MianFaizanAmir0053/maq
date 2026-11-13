import Image, { type ImageProps } from 'next/image';

/** Intrinsic sizes of the images in /public/assets, so next/image can size and optimise them. */
const SIZES: Record<string, [number, number]> = {
  '/assets/img-01-d0872144.jpg': [1800, 600],
  '/assets/img-02-9e6f5045.jpg': [1800, 600],
  '/assets/img-03-1096dc4e.jpg': [1800, 600],
  '/assets/img-04-843dc6a3.jpg': [1800, 600],
  '/assets/img-05-d6dd3910.jpg': [407, 300],
  '/assets/img-06-6845b64c.webp': [1672, 941],
  '/assets/img-07-6c323c24.webp': [1672, 941],
  '/assets/img-08-78704772.webp': [1672, 941],
  '/assets/img-09-1306451b.webp': [1672, 941],
  '/assets/img-10-d7f3e453.jpg': [900, 900],
  '/assets/img-11-e27e7136.jpg': [900, 567],
  '/assets/img-12-730bb099.jpg': [900, 714],
  '/assets/img-13-b3047fd0.jpg': [640, 508],
  '/assets/img-14-e1aac2f3.jpg': [640, 508],
};

type Props = Omit<ImageProps, 'src' | 'width' | 'height'> & { src: string };

/** next/image with the width and height filled in from SIZES. */
export default function Pic({ src, alt, sizes = '(max-width: 700px) 80vw, 420px', ...rest }: Props) {
  const [width, height] = SIZES[src] ?? [800, 600];
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} {...rest} />;
}
