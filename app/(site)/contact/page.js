import Link from 'next/link';
import { Mail, MessageCircle, MapPin, LifeBuoy } from 'lucide-react';
import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Contact TryLinqr' };

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Get in touch"
      title="We&apos;d love to hear from you."
      intro="Pick the channel that fits — we triage fast and answer faster."
      lastUpdated="May 2026"
    >
      <div className="not-prose mt-2 grid gap-4 sm:grid-cols-2">
        <Card
          icon={LifeBuoy}
          title="Help with a booking"
          body="Issues with tickets, payments or your account — our Support team responds quickly and routes to organizers when needed."
          cta={{ href: '/support', label: 'Open Support Center' }}
        />
        <Card
          icon={Mail}
          title="Press & general"
          body="Story ideas, partnerships, brand assets or just saying hi."
          cta={{ href: 'mailto:hello@trylinqr.com', label: 'hello@trylinqr.com' }}
        />
        <Card
          icon={MessageCircle}
          title="Organizer onboarding"
          body="Want to host events on TryLinqr or migrate your existing ones?"
          cta={{
            href: 'mailto:organizers@trylinqr.com',
            label: 'organizers@trylinqr.com',
          }}
        />
        <Card
          icon={MapPin}
          title="Office"
          body="HQ in New Delhi. We&apos;re a remote-first team across India."
          cta={{ href: '/about', label: 'More about us' }}
        />
      </div>
    </LegalPage>
  );
}

function Card({ icon: Icon, title, body, cta }) {
  return (
    <div className="rounded-2xl border border-ink-line bg-white p-6 shadow-card">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-lg font-bold text-obsidian">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-obsidian/65">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
        >
          {cta.label} →
        </Link>
      )}
    </div>
  );
}
