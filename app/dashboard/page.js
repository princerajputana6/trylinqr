'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CalendarPlus, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/admin/StatusBadge';

/* ── Inline SVG sparkline ───────────────────────────── */
function Sparkline({ data = [], color = '#c9ddb1' }) {
  if (!data.length) return null;
  const W = 200, H = 60;
  const vals = data.map((d) => d.bookings || 0);
  const max = Math.max(...vals, 1);
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - (v / max) * H * 0.85;
    return `${x},${y}`;
  });
  const path = `M${pts.join(' L')}`;
  const fill = `M${pts[0]} L${pts.join(' L')} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Circular gauge ─────────────────────────────────── */
function CircleGauge({ pct = 0, color = '#944268', label, value }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[90px] w-[90px] shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f0ece8" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-obsidian">{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div>
        <p className="text-xl font-extrabold text-obsidian">{value?.toLocaleString('en-IN')}</p>
        <p className="text-sm text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

/* ── Progress bar ───────────────────────────────────── */
function ProgressBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
        <span className="font-bold text-obsidian">{value?.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-pearl">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ── Mini stat card with illustration SVG ────────────── */
function MiniStatCard({ label, value, delta, icon: IllustrationIcon, accent }) {
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
              {up ? '+' : ''}{delta.toFixed(1)}% vs last month
            </div>
          )}
        </div>
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl text-2xl"
          style={{ background: accent }}
        >
          {IllustrationIcon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingVerification = session?.user?.isApproved === false;

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/events').then((r) => r.json()),
    ]).then(([s, e]) => {
      if (s.ok) { setStats(s.stats); setTrend(s.bookingsTrend || []); }
      if (e.ok) setEvents(e.events || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner full />;

  const s = stats || {};
  const published = s.publishedEvents || 0;
  const total = s.totalEvents || 0;
  const draft = total - published;
  const soldPct = total > 0 ? (published / total) * 100 : 0;
  const tickets = s.totalTickets || 0;
  const views = s.totalViews || 0;
  const viewPct = views > 0 ? Math.min((tickets / views) * 100, 100) : 0;

  return (
    <div className="space-y-5">
      {pendingVerification && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Account verification pending — access is limited.</p>
            <p className="mt-0.5 text-amber-900/80">
              Events go live on TryLinqr only after your account is verified by our team.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStatCard
          label="Total events"
          value={total}
          delta={2.6}
          accent="rgba(148,66,104,0.10)"
          icon={<span>🗓️</span>}
        />
        <MiniStatCard
          label="Tickets sold"
          value={tickets}
          delta={0.2}
          accent="rgba(201,221,177,0.25)"
          icon={<span>🎟️</span>}
        />
        <MiniStatCard
          label="Cancelled / Draft"
          value={draft}
          delta={-0.1}
          accent="rgba(166,197,220,0.20)"
          icon={<span>📋</span>}
        />
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue card with sparkline */}
        <div className="col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl bg-obsidian p-6 text-white shadow-card lg:col-span-1">
          <div>
            <p className="text-sm text-white/55">Total revenue</p>
            <p className="mt-1 font-display text-3xl font-extrabold">
              {formatCurrency(s.totalRevenue || 0)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-jade-300">
              <TrendingUp className="h-3.5 w-3.5" /> +2.6% last month
            </div>
          </div>
          <div className="mt-4 h-16">
            <Sparkline data={trend} color="#c9ddb1" />
          </div>
        </div>

        {/* Bookings breakdown */}
        <div className="col-span-1 rounded-2xl border border-ink-line bg-white p-5 shadow-card lg:col-span-1">
          <h3 className="mb-4 font-bold">Published vs Draft</h3>
          <div className="space-y-4">
            <ProgressBar label="Published" value={published} max={total || 1} color="#6a9a50" />
            <ProgressBar label="Draft" value={draft} max={total || 1} color="#c97a3a" />
            <ProgressBar label="Views" value={views} max={Math.max(views, 1)} color="#944268" />
          </div>
        </div>

        {/* Events available donut */}
        <div className="col-span-1 rounded-2xl border border-ink-line bg-white p-5 shadow-card">
          <h3 className="mb-3 font-bold">Events available</h3>
          <div className="flex flex-col items-center">
            <div className="relative h-[140px] w-[140px]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f0ece8" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#6a9a50" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - soldPct / 100)}`}
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
                <span className="font-bold">{draft}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — circular gauges + recent events */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Circular gauges */}
        <div className="col-span-1 rounded-2xl border border-ink-line bg-white p-5 shadow-card">
          <h3 className="mb-4 font-bold">Conversion</h3>
          <div className="space-y-5">
            <CircleGauge
              pct={soldPct}
              color="#6a9a50"
              label="Published events"
              value={published}
            />
            <CircleGauge
              pct={viewPct}
              color="#c97a3a"
              label="Views → Tickets"
              value={tickets}
            />
          </div>
        </div>

        {/* Recent events */}
        <div className="col-span-2 overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
            <h3 className="font-bold">Recent events</h3>
            <Link href="/dashboard/events" className="text-xs font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="grid place-items-center py-16 text-center">
              <p className="font-semibold">No events yet</p>
              <Link href="/dashboard/events/create" className="btn-primary mt-3">
                <CalendarPlus className="h-4 w-4" /> Create event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-ink-line">
              {events.slice(0, 5).map((e) => (
                <Link
                  key={e._id}
                  href={`/dashboard/events/${e._id}/edit`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-pearl/50"
                >
                  <img
                    src={e.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=70'}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold text-obsidian">{e.title}</p>
                    <p className="text-xs text-ink-muted">{formatDate(e.startDate)} · {e.venue?.city || 'Online'}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-bold text-obsidian">{formatCurrency(e.stats?.revenue || 0)}</p>
                    <p className="text-xs text-ink-muted">{e.stats?.tickets || 0} sold</p>
                  </div>
                  <StatusBadge status={e.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
