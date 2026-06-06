import './globals.css';
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
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
const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Long-form SEO keyword bank — applied at the root so every page inherits
// unless a specific page overrides its own metadata.keywords.
// Individual pages can spread KEYWORDS_BASE then add page-specific extras.
export const KEYWORDS_BASE = [
  // Core platform
  'event booking', 'ticket booking', 'event tickets', 'online tickets',
  'event registration', 'ticketing platform', 'online event booking',
  'event listing', 'event discovery',
  // Categories
  'workshops', 'concerts', 'festivals', 'bike rides', 'comedy shows',
  'sports events', 'food festivals', 'live events', 'local events',
  'upcoming events', 'weekend events',
  // Product features
  'QR ticketing', 'event check-in', 'ticket sales', 'sell tickets online',
  'create event', 'event organizer', 'event management', 'event marketplace',
  'things to do', 'event registration platform',
  // Long-tail / organizer
  'how to sell event tickets online',
  'best event ticketing platform in india',
  'create an event and sell tickets online',
  'online event registration platform india',
  'event ticketing software for organizers',
  'QR code ticketing platform for events',
  'commission free event ticketing platform',
  'alternative to bookmyshow for organizers',
  'event check in software with QR code',
  'ticket booking platform for workshops',
  // Long-tail / discovery
  'events happening near me this weekend',
  'upcoming events in delhi this weekend',
  'things to do in delhi this weekend',
  'best workshops near me',
  'live events near me today',
  'upcoming concerts near me',
  'weekend activities near me',
  'local events near me',
  'food festivals near me',
  'comedy shows near me this weekend',
  'motorcycle rides in delhi registration',
  'bike ride events near me',
  'marathon registration online india',
  'networking events in delhi',
  'startup events and workshops near me',
  // Brand
  'TryLinqr', 'trylinqr', 'try linqr',
];

export const metadata = {
  title: {
    default: 'TryLinqr — Discover & Book Events',
    template: '%s · TryLinqr',
  },
  description:
    'TryLinqr is India\'s premium event booking & ticketing platform — discover and book concerts, workshops, festivals, bike rides, comedy shows, sports events, food festivals and weekend things to do. Organizers create events and sell tickets online with QR check-in, zero commission to start.',
  keywords: KEYWORDS_BASE,
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  openGraph: {
    title: 'TryLinqr — Discover & Book Events',
    description:
      'India\'s event booking & ticketing platform. Concerts, workshops, festivals, bike rides, comedy and more — book online with QR tickets.',
    type: 'website',
    siteName: 'TryLinqr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TryLinqr — Discover & Book Events',
    description:
      'India\'s event booking & ticketing platform. Concerts, workshops, festivals, bike rides and more.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#f2f1ed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${serif.variable}`}
    >
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
