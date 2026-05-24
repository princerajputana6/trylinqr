import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'TryLinqr — Discover & Book Events',
    template: '%s · TryLinqr',
  },
  description:
    'TryLinqr is a premium multi-domain event booking platform. Discover concerts, workshops, festivals, sports, comedy and more — and book in seconds.',
  keywords: ['events', 'booking', 'concerts', 'workshops', 'tickets', 'TryLinqr'],
  icons: { icon: '/trylinqr.png', apple: '/trylinqr.png' },
  openGraph: {
    title: 'TryLinqr — Discover & Book Events',
    description: 'Discover and book events of every kind.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#f2f1ed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
