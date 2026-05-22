import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-line bg-ink-soft">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 w-fit rounded-xl bg-white px-3 py-2">
            <Image
              src="/trylinqr.png"
              alt="TryLinqr"
              width={140}
              height={38}
              className="h-8 w-auto"
            />
          </div>
          <p className="max-w-xs text-sm text-ink-muted">
            Discover and book events of every kind — bike rides, jagrans,
            concerts, workshops and more. Anyone can host. Everyone can join.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-ink-muted transition-colors hover:bg-brand-500 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Categories</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="transition-colors hover:text-brand-400"
                >
                  {c.emoji} {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/explore" className="hover:text-brand-400">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/admin-register" className="hover:text-brand-400">
                Become an organizer
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-400">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-brand-400">
                Sign up
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Get the app</h4>
          <p className="text-sm text-ink-muted">
            The TryLinqr mobile app is coming soon to iOS and Android.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <div className="rounded-lg border border-ink-line bg-white/5 px-4 py-2 text-sm text-ink-muted">
              📱 App Store — soon
            </div>
            <div className="rounded-lg border border-ink-line bg-white/5 px-4 py-2 text-sm text-ink-muted">
              🤖 Google Play — soon
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-line py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} TryLinqr. Built for event lovers everywhere.
      </div>
    </footer>
  );
}
