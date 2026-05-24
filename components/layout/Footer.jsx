import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Apple,
  Smartphone,
  Mail,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin-register', label: 'Become an organizer' },
];

const SUPPORT = [
  { href: '/support', label: 'Help & Support' },
  { href: '/support/new', label: 'Raise a ticket' },
  { href: '/bike-shipping', label: 'Bike shipping' },
  { href: '/my-bookings', label: 'My bookings' },
  { href: '/profile', label: 'My profile' },
];

const LEGAL = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
];

const FOOTER_CATEGORIES = ['concert', 'bike-ride', 'workshop', 'sports', 'festival', 'food'];

export default function Footer() {
  return (
    <footer className="mt-20 bg-obsidian text-white">
      {/* main footer */}
      <div className="container-page grid gap-10 py-16 lg:grid-cols-12">
        {/* brand + social */}
        <div className="lg:col-span-4">
          <div className="mb-5 w-fit rounded-xl bg-white px-3 py-2 shadow-card">
            <Image
              src="/trylinqr.png"
              alt="TryLinqr"
              width={140}
              height={38}
              className="h-8 w-auto"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            A cinematic ecosystem for discovering and booking events of every
            kind — concerts, rides, workshops, festivals and beyond.
          </p>

          <div className="mt-6 flex gap-2">
            {[
              { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-sand-400 hover:bg-sand-500 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="mt-6 grid gap-2 text-sm">
            <a
              href="mailto:hello@trylinqr.com"
              className="inline-flex items-center gap-2 text-white/75 hover:text-sand-400"
            >
              <Mail className="h-4 w-4 text-sand-400" /> hello@trylinqr.com
            </a>
            <Link
              href="/bike-shipping"
              className="inline-flex items-center gap-2 text-white/75 hover:text-sand-400"
            >
              <Truck className="h-4 w-4 text-sand-400" /> Bike shipping calculator
            </Link>
            <span className="inline-flex items-center gap-2 text-white/60">
              <ShieldCheck className="h-4 w-4 text-sand-400" /> Secure payments
              by Razorpay
            </span>
          </div>
        </div>

        <FooterCol title="Company" items={COMPANY} className="lg:col-span-2" />
        <FooterCol title="Support" items={SUPPORT} className="lg:col-span-2" />
        <FooterCol title="Legal" items={LEGAL} className="lg:col-span-2" />

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand-400">
            Categories
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {FOOTER_CATEGORIES.map((slug) => {
              const c = CATEGORIES.find((x) => x.slug === slug);
              if (!c) return null;
              const Icon = c.icon;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-sand-400"
                  >
                    <Icon className="h-3.5 w-3.5 text-sand-400" />
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* app + trust strip */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-5 py-7 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-sand-400">
              Get the app
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
              <Apple className="h-4 w-4 text-sand-400" /> App Store — soon
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
              <Smartphone className="h-4 w-4 text-sand-400" /> Google Play — soon
            </span>
          </div>
          <div className="text-xs text-white/55 sm:text-right">
            QR ticketing · Verified organizers · Instant payouts
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} TryLinqr Technologies Pvt. Ltd. All
            rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-sand-400">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-sand-400">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-sand-400">
              Cookies
            </Link>
            <Link href="/refund-policy" className="hover:text-sand-400">
              Refunds
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, className = '' }) {
  return (
    <div className={className}>
      <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand-400">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm text-white/70">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="transition-colors hover:text-sand-400">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
