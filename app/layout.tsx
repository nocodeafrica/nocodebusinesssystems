import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesque = Space_Grotesk({
  variable: '--font-space-grotesque',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Horizon Systems',
  description: 'We build custom business systems for companies ready to scale',
  icons: {
    icon: [
      { url: '/Horizon Systems Favicon.png', type: 'image/png' },
      {
        url: '/Horizon Systems Favicon.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/Horizon Systems Favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/Horizon Systems Favicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/Horizon Systems Favicon.png',
        color: '#0d3366',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0d3366',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesque.variable} relative`}
        style={{ backgroundColor: 'transparent' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
