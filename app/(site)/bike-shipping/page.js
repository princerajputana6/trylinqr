'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  MapPin,
  Bike,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Calculator,
  PackageCheck,
  HandCoins,
  Sparkles,
  LifeBuoy,
} from 'lucide-react';
import {
  BIKE_CATEGORIES,
  SHIPPING_CITIES,
  calcShipping,
} from '@/lib/bikeShipping';
import { formatCurrency } from '@/lib/utils';

const cityNames = SHIPPING_CITIES.map((c) => c.name).sort();

export default function BikeShippingPage() {
  const [form, setForm] = useState({
    fromCity: 'Delhi',
    toCity: 'Manali',
    category: 'cruiser',
    weight: 235,
    declaredValue: 250000,
    pickupDate: '',
    express: false,
    insurance: true,
  });

  const set = (key) => (e) => {
    const value =
      e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      // auto-fill weight when category changes
      if (key === 'category') {
        const cat = BIKE_CATEGORIES.find((b) => b.value === value);
        if (cat) next.weight = cat.weight;
      }
      return next;
    });
  };

  const quote = useMemo(
    () =>
      calcShipping({
        fromCity: form.fromCity,
        toCity: form.toCity,
        weight: Number(form.weight) || 0,
        declaredValue: Number(form.declaredValue) || 0,
        express: form.express,
        insurance: form.insurance,
      }),
    [form]
  );

  const summary = quote
    ? `From ${form.fromCity} → ${form.toCity} · ${BIKE_CATEGORIES.find(
        (b) => b.value === form.category
      )?.label} (${form.weight} kg)`
    : '';
  const supportHref = `/support/new?subject=${encodeURIComponent(
    'Bike shipping quote · ' + summary
  )}`;

  return (
    <div className="bg-pearl">
      <div className="container-page py-12 sm:py-16">
        {/* header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow flex items-center justify-center gap-2">
            <Truck className="h-3.5 w-3.5" /> Logistics for riders
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-obsidian sm:text-5xl">
            Bike Shipping Cost Calculator
          </h1>
          <p className="mt-4 text-base leading-relaxed text-obsidian/65 sm:text-lg">
            Ship your bike to the start of a ride, a multi-day tour or back
            home in one tap. Pick the cities, your bike, and we&apos;ll give
            you an instant indicative quote — finalized once our logistics
            team confirms carrier availability.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* form */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-brand-700" />
              <h2 className="font-display text-xl font-bold text-obsidian">
                Shipment details
              </h2>
            </div>
            <p className="mt-1 text-sm text-obsidian/65">
              Update any field — the quote on the right recalculates live.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="label flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-700" /> Pickup city
                </label>
                <select
                  className="input"
                  value={form.fromCity}
                  onChange={set('fromCity')}
                >
                  {cityNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="label flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-700" /> Drop-off
                  city
                </label>
                <select
                  className="input"
                  value={form.toCity}
                  onChange={set('toCity')}
                >
                  {cityNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label flex items-center gap-1.5">
                  <Bike className="h-3.5 w-3.5 text-brand-700" /> Bike category
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {BIKE_CATEGORIES.map((c) => {
                    const active = form.category === c.value;
                    return (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => set('category')({ target: { value: c.value } })}
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? 'border-brand-700 bg-brand-700/[0.06]'
                            : 'border-ink-line bg-white hover:border-obsidian/25'
                        }`}
                      >
                        <p className="font-display text-sm font-bold text-obsidian">
                          {c.label}
                        </p>
                        <p className="text-xs text-obsidian/65">
                          {c.description}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-brand-700">
                          ~ {c.weight} kg
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="label">Bike weight (kg)</label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  className="input"
                  value={form.weight}
                  onChange={set('weight')}
                />
              </div>
              <div>
                <label className="label">Pickup date</label>
                <input
                  type="date"
                  className="input"
                  value={form.pickupDate}
                  onChange={set('pickupDate')}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label">
                  Declared value{' '}
                  <span className="text-xs font-normal text-ink-muted">
                    (used for insurance)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  className="input"
                  value={form.declaredValue}
                  onChange={set('declaredValue')}
                />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 hover:border-brand-700/40 sm:col-span-1">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-brand-700"
                  checked={form.express}
                  onChange={set('express')}
                />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-obsidian">
                    <Zap className="h-3.5 w-3.5 text-brand-700" /> Express
                    delivery
                  </p>
                  <p className="text-xs text-obsidian/65">
                    Priority handling, faster ETA. +35% surcharge.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-ink-line bg-white p-4 hover:border-brand-700/40 sm:col-span-1">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-brand-700"
                  checked={form.insurance}
                  onChange={set('insurance')}
                />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-obsidian">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-700" />{' '}
                    Transit insurance
                  </p>
                  <p className="text-xs text-obsidian/65">
                    1.5% of declared value (min ₹199). Full damage cover in
                    transit.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* quote panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <QuoteCard quote={quote} form={form} supportHref={supportHref} />
          </aside>
        </div>

        {/* how it works */}
        <section className="mt-20">
          <p className="section-eyebrow text-center">How it works</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
            From pickup to drop-off in 4 steps
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Calculator,
                title: 'Get an instant quote',
                body: 'Use this calculator to estimate cost — pricing locks once we confirm carrier.',
              },
              {
                icon: PackageCheck,
                title: 'We pick up your bike',
                body: 'A vetted logistics partner collects the bike at your scheduled time.',
              },
              {
                icon: Truck,
                title: 'Door-to-door transit',
                body: 'Tracked transit with daily status updates on WhatsApp and email.',
              },
              {
                icon: HandCoins,
                title: 'Deliver & inspect',
                body: 'Sign-off at the drop-off city after a full handover inspection.',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="hover-glow rounded-2xl border border-ink-line bg-white p-6 shadow-card"
                >
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-display text-base font-bold text-obsidian">
                    {s.title}
                  </p>
                  <p className="mt-1 text-sm text-obsidian/65">{s.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* faq */}
        <section className="mt-16">
          <p className="section-eyebrow text-center">FAQ</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
            Quick answers
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-2">
            {[
              {
                q: 'Is this the final price?',
                a: 'It’s an indicative quote. Once you confirm pickup we lock the price with our logistics partner; you only pay after carrier confirmation.',
              },
              {
                q: 'Is the bike drained of fuel?',
                a: 'We drain the fuel to under 1 litre at pickup as per IATA / road-transport safety standards. The battery is disconnected for non-EV bikes.',
              },
              {
                q: 'How is insurance settled if something happens?',
                a: 'You file a claim with us within 48 hours of delivery; payouts on approved claims hit your account within 7–10 business days.',
              },
              {
                q: 'Do you ship to / from any city?',
                a: 'We cover all major and most Tier-2 cities in India. If your city isn’t in the dropdown, raise a quote ticket and our team will custom-route it.',
              },
            ].map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-ink-line bg-white p-5 shadow-card"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-obsidian">
                  {f.q}
                  <span className="float-right text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-obsidian/70">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuoteCard({ quote, form, supportHref }) {
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl border border-brand-900/15 bg-sand-50 p-6 shadow-elevated"
    >
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.25]" />
      <div className="pointer-events-none absolute inset-2 rounded-[14px] border border-dashed border-brand-700/25" />
      <span className="pointer-events-none absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />
      <span className="pointer-events-none absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />

      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-700/70">
          Indicative Quote
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-900">
          {form.fromCity} → {form.toCity}
        </h2>

        <AnimatePresence mode="wait">
          {!quote || quote.sameCity ? (
            <motion.div
              key="same"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-xl border border-dashed border-brand-700/30 bg-white p-4 text-sm text-obsidian/70"
            >
              Pick two different cities to get a quote.
            </motion.div>
          ) : (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat
                  icon={MapPin}
                  label="Distance"
                  value={`${quote.distance.toLocaleString('en-IN')} km`}
                />
                <Stat
                  icon={Calendar}
                  label="Transit"
                  value={
                    form.express
                      ? `${quote.expressDays} day${
                          quote.expressDays > 1 ? 's' : ''
                        }`
                      : `${quote.transitDays} days`
                  }
                />
              </div>

              {/* breakdown */}
              <div className="mt-5 space-y-2 rounded-xl border border-ink-line bg-white p-4 text-sm">
                <Row label="Base handling" value={quote.base} />
                <Row
                  label={`Distance · ${quote.distance} km`}
                  value={quote.distanceCharge}
                />
                {quote.weightSurcharge > 0 && (
                  <Row
                    label={`Weight surcharge (${Math.round(
                      quote.surchargePct * 100
                    )}%)`}
                    value={quote.weightSurcharge}
                  />
                )}
                {quote.expressSurcharge > 0 && (
                  <Row
                    label="Express priority"
                    value={quote.expressSurcharge}
                  />
                )}
                {quote.insuranceFee > 0 && (
                  <Row label="Transit insurance" value={quote.insuranceFee} />
                )}
                <div className="my-2 border-t border-dashed border-ink-line" />
                <Row label="Subtotal" value={quote.subtotal} subtle />
                <Row label="GST · 18%" value={quote.gst} subtle />
                <div className="my-2 border-t border-dashed border-ink-line" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-obsidian/65">
                    Estimated total
                  </span>
                  <span className="font-display text-2xl font-extrabold text-brand-700">
                    {formatCurrency(quote.total)}
                  </span>
                </div>
              </div>

              <Link
                href={supportHref}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-glow-soft transition-transform hover:-translate-y-0.5 hover:bg-brand-800"
              >
                <LifeBuoy className="h-4 w-4" /> Request Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-center text-[11px] text-obsidian/55">
                You&apos;ll be taken to a pre-filled support ticket so our team
                can confirm the carrier and finalize pricing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 flex items-start gap-2 text-[11px] text-obsidian/55">
          <Sparkles className="mt-0.5 h-3 w-3 text-brand-700" />
          Indicative pricing only. Final amount is confirmed after pickup
          location verification and may vary by ±10%.
        </p>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-line bg-white p-3">
      <Icon className="h-4 w-4 text-brand-700" />
      <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="font-display text-base font-bold text-obsidian">{value}</p>
    </div>
  );
}

function Row({ label, value, subtle }) {
  return (
    <div
      className={`flex items-center justify-between ${
        subtle ? 'text-obsidian/65' : 'text-obsidian'
      }`}
    >
      <span className="text-xs">{label}</span>
      <span className={`text-sm font-semibold ${subtle ? '' : 'text-obsidian'}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}
