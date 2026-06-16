'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, UserCheck, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

function Sparkline({ data = [], color = '#c9ddb1' }) {
  if (!data.length) return null;
  const W = 200, H = 60;
  const vals = data.map((d) => d.revenue || d.bookings || 0);
  const max = Math.max(...vals, 1);
  const pts = vals.map((v, i) => {
    const x = (i / Math.max(vals.length - 1, 1)) * W;
    const y = H - (v / max) * H * 0.85;
    return `${x},${y}`;
  });
  const path = `M${pts.join(' L')}`;
  const fill = `M${pts[0]} L${pts.join(' L')} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg2)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleGauge({ pct = 0, color = '#944268', label, value }) {
  const r = 38, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[88px] w-[88px] shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f0ece8" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-obsidian">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <div>
        <p className="text-xl font-extrabold text-obsidian">{value?.toLocaleString('en-IN')}</p>
        <p className="text-sm text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
        <span className="font-bold text-obsidian">{value?.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-pearl">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, delta, accent, icon }) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted">{label}</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-obsidian">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {delta !== undefined && (
            <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
              {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {up ? '+' : ''}{delta.toFixed(1)}%
            </div>
          )}
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl text-2xl" style={{ background: accent }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SuperadminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/superadmin/stats')
      .then((r) => r.json())
      .then((d) => { if (d.ok) setData(d); setLoading(false); });
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (!data) return <p className="text-ink-muted">No data available.</p>;

  const { stats, eventsByCategory } = data;
  const total = stats.totalEvents || 0;
  const published = stats.publishedEvents || 0;
  const pubPct = total > 0 ? (published / total) * 100 : 0;
  const customers = stats.customers || 0;
  const admins = stats.admins || 0;
  const totalUsers = stats.totalUsers || 0;
  const adminPct = totalUsers > 0 ? (admins / totalUsers) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Pending action banners */}
      {(stats.pendingAdmins > 0 || stats.pendingEvents > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.pendingAdmins > 0 && (
            <Link
              href="/superadmin/admins"
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm transition hover:border-amber-300"
            >
              <UserCheck className="h-5 w-5 text-amber-500" />
              <span><b>{stats.pendingAdmins}</b> organizer{stats.pendingAdmins > 1 ? 's' : ''} awaiting approval</span>
              <span className="text-amber-400">›</span>
            </Link>
          )}
          {stats.pendingEvents > 0 && (
            <Link
              href="/superadmin/events?status=pending"
              className="flex items-center gap-3 rounded-xl border border-brand-700/20 bg-brand-700/5 px-4 py-3 text-sm transition hover:border-brand-700/40"
            >
              <Clock className="h-5 w-5 text-brand-700" />
              <span><b>{stats.pendingEvents}</b> event{stats.pendingEvents > 1 ? 's' : ''} pending review</span>
              <span className="text-brand-700">›</span>
            </Link>
          )}
        </div>
      )}

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStatCard label="Total bookings" value={stats.totalBookings} delta={2.6} accent="rgba(201,221,177,0.25)" icon={<span>📋</span>} />
        <MiniStatCard label="Tickets sold" value={stats.totalTickets || stats.totalBookings} delta={0.2} accent="rgba(148,66,104,0.10)" icon={<span>🎟️</span>} />
        <MiniStatCard label="Cancelled events" value={total - published} delta={-0.1} accent="rgba(166,197,220,0.20)" icon={<span>❌</span>} />
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue sparkline card */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-obsidian p-6 text-white shadow-card">
          <div>
            <p className="text-sm text-white/55">Platform gross revenue</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{formatCurrency(stats.totalRevenue || 0)}</p>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-jade-300">
              <TrendingUp className="h-3.5 w-3.5" /> +2.6% last month
            </div>
          </div>
          <div className="mt-4 h-16">
            <Sparkline data={eventsByCategory?.map((c, i) => ({ revenue: c.value || 0 })) || []} color="#c9ddb1" />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
          <h3 className="mb-4 font-bold">Event breakdown</h3>
          <div className="space-y-4">
            <ProgressBar label="Published" value={published} max={total || 1} color="#6a9a50" />
            <ProgressBar label="Total users" value={totalUsers} max={Math.max(totalUsers, 1)} color="#944268" />
            <ProgressBar label="Organizers" value={admins} max={Math.max(totalUsers, 1)} color="#c97a3a" />
          </div>
        </div>

        {/* Events available donut */}
        <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
          <h3 className="mb-3 font-bold">Events available</h3>
          <div className="flex flex-col items-center">
            <div className="relative h-[140px] w-[140px]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f0ece8" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#6a9a50" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - pubPct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-xl font-extrabold text-obsidian">{total}</p>
                <p className="text-xs text-ink-muted">Events</p>
              </div>
            </div>
            <div className="mt-3 w-full space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-jade-300" /> Published</span>
                <span className="font-bold">{published}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pearl" style={{ border: '1.5px solid #d1ccca' }} /> Draft</span>
                <span className="font-bold">{total - published}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — gauges + category list */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
          <h3 className="mb-4 font-bold">User breakdown</h3>
          <div className="space-y-5">
            <CircleGauge pct={pubPct} color="#6a9a50" label="Published events" value={published} />
            <CircleGauge pct={adminPct} color="#944268" label="Organizers" value={admins} />
          </div>
        </div>

        <div className="col-span-2 overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
          <div className="border-b border-ink-line px-5 py-4">
            <h3 className="font-bold">Events by category</h3>
          </div>
          {eventsByCategory?.length ? (
            <div className="divide-y divide-ink-line">
              {eventsByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-brand-700" />
                    <span className="font-medium capitalize text-obsidian">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-pearl sm:block">
                      <div
                        className="h-full rounded-full bg-brand-700"
                        style={{ width: `${Math.round((cat.value / (eventsByCategory.reduce((s, c) => s + c.value, 0) || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-bold text-obsidian">{cat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-40 place-items-center text-sm text-ink-muted">No events yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
