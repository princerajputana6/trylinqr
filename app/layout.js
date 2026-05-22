import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'TryLinqr — Discover & Book Events',
    template: '%s · TryLinqr',
  },
  description:
    'TryLinqr is a multi-domain event booking platform. Discover bike rides, jagrans, concerts, workshops, sports and more — book free or paid tickets in seconds.',
  keywords: ['events', 'booking', 'concerts', 'workshops', 'tickets', 'TryLinqr'],
  icons: { icon: '/trylinqr.png', apple: '/trylinqr.png' },
  openGraph: {
    title: 'TryLinqr — Discover & Book Events',
    description: 'Discover and book events of every kind.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#070b16',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
