'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Server, CreditCard, Mail, Image } from 'lucide-react';

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState(null);

  useEffect(() => {
    fetch('/api/system/health')
      .then((r) => r.json())
      .then((d) => setIntegrations(d.integrations || {}))
      .catch(() => setIntegrations({}));
  }, []);

  const items = [
    {
      key: 'database',
      icon: Server,
      label: 'MongoDB database',
      desc: 'Stores users, events, bookings and reviews.',
    },
    {
      key: 'razorpay',
      icon: CreditCard,
      label: 'Razorpay payments',
      desc: 'Processes paid ticket bookings. Free events work without it.',
    },
    {
      key: 'mailer',
      icon: Mail,
      label: 'Gmail SMTP email',
      desc: 'Sends verification, booking and approval emails.',
    },
    {
      key: 'cloudinary',
      icon: Image,
      label: 'Cloudinary media',
      desc: 'Hosts event banners, galleries and avatars.',
    },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold">Platform settings</h2>
      <p className="mb-6 mt-1 text-sm text-ink-muted">
        Integration status. Configure values in your <code>.env.local</code>.
      </p>

      <div className="space-y-3">
        {items.map((it) => {
          const ok = integrations?.[it.key];
          const Icon = it.icon;
          return (
            <div key={it.key} className="card flex items-center gap-4 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <Icon className="h-5 w-5 text-brand-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{it.label}</p>
                <p className="text-xs text-ink-muted">{it.desc}</p>
              </div>
              {integrations === null ? (
                <span className="text-xs text-ink-muted">…</span>
              ) : ok ? (
                <span className="chip bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              ) : (
                <span className="chip bg-pearl text-ink-muted">
                  <XCircle className="h-3.5 w-3.5" /> Not set
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="card mt-5 p-5">
        <h3 className="font-bold">Platform fee</h3>
        <p className="mt-1 text-sm text-ink-muted">
          A {process.env.NEXT_PUBLIC_PLATFORM_FEE || 5}% fee is applied on paid
          bookings. Change <code>PLATFORM_FEE_PERCENT</code> in your environment
          to adjust it.
        </p>
      </div>
    </div>
  );
}
