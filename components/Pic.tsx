import Image, { type ImageProps } from 'next/image';

/** Intrinsic sizes of the images in /public/assets, so next/image can size and optimise them. */
const SIZES: Record<string, [number, number]> = {
  '/assets/img-01-d0872144.jpg': [1800, 600],
  '/assets/img-02-9e6f5045.jpg': [1800, 600],
  '/assets/img-03-1096dc4e.jpg': [1800, 600],
  '/assets/img-04-843dc6a3.jpg': [1800, 600],
  '/assets/img-05-d6dd3910.jpg': [407, 300],
  '/assets/img-35-b46ed744.webp': [1672, 941],
  '/assets/img-38-b8940c2a.webp': [1672, 941],
  '/assets/img-08-78704772.webp': [1672, 941],
  '/assets/img-09-1306451b.webp': [1672, 941],
  '/assets/img-10-d7f3e453.jpg': [900, 900],
  '/assets/img-11-e27e7136.jpg': [900, 567],
  '/assets/img-12-730bb099.jpg': [900, 714],
  '/assets/img-13-b3047fd0.jpg': [640, 508],
  '/assets/img-14-e1aac2f3.jpg': [640, 508],
  '/assets/img-15-22505d70.jpg': [1402, 1122],
  '/assets/img-16-ed114285.jpg': [1402, 1122],
  '/assets/img-17-9f2b005f.jpg': [1402, 1122],
  '/assets/img-19-69ecc02b.jpg': [1402, 1122],
  '/assets/img-20-fe6ff034.jpg': [1402, 1122],
  '/assets/img-21-80a29e8a.jpg': [1402, 1122],
  '/assets/img-22-332d5c6f.jpg': [1403, 1121],
  '/assets/img-23-c7ed8510.jpg': [1402, 1122],
  '/assets/img-24-34e41e0a.jpg': [1402, 1122],
  '/assets/img-25-9604fc61.jpg': [1402, 1122],
  '/assets/img-26-9e2a7389.jpg': [1402, 1122],
  '/assets/img-27-0a9d54f1.jpg': [1402, 1122],
  '/assets/img-28-93aaa2f9.jpg': [1402, 1122],
  '/assets/img-29-0afd9679.jpg': [1402, 1122],
  '/assets/img-36-9f07c8da.jpg': [1402, 1122],
  '/assets/img-37-925006f3.jpg': [1402, 1122],
  '/assets/img-32-18048921.jpg': [2172, 724],
  '/assets/img-33-35b98c87.jpg': [2172, 724],
  '/assets/img-34-787888ff.jpg': [2172, 724],
};

type Props = Omit<ImageProps, 'src' | 'width' | 'height'> & { src: string };

/** next/image with the width and height filled in from SIZES. */
export default function Pic({ src, alt, sizes = '(max-width: 700px) 80vw, 420px', ...rest }: Props) {
  const [width, height] = SIZES[src] ?? [800, 600];
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} {...rest} />;
}
