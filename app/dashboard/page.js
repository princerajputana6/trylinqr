'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  CalendarDays,
  Ticket,
  IndianRupee,
  Eye,
  CalendarPlus,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingVerification = session?.user?.isApproved === false;

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/events').then((r) => r.json()),
    ]).then(([s, e]) => {
      if (s.ok) setStats(s.stats);
      if (e.ok) setEvents(e.events || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-8">
      {pendingVerification && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1 text-sm text-amber-900">
            <p className="font-semibold">
              Account verification pending — your access is limited.
            </p>
            <p className="mt-1 text-amber-900/85">
              You can create and publish events from your dashboard, but they
              will <b>only go live on TryLinqr once your organizer account is
              verified</b> by our team. We’ll email you as soon as you’re
              approved.
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Total events"
          value={stats?.totalEvents || 0}
          accent="brand"
          index={0}
        />
        <StatCard
          icon={Ticket}
          label="Tickets sold"
          value={stats?.totalTickets || 0}
          accent="orchid"
          index={1}
        />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={stats?.totalRevenue || 0}
          prefix="₹"
          accent="jade"
          index={2}
        />
        <StatCard
          icon={Eye}
          label="Total views"
          value={stats?.totalViews || 0}
          accent="baby"
          index={3}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/events/create" className="btn-primary">
          <CalendarPlus className="h-4 w-4" /> Create new event
        </Link>
        <Link href="/dashboard/analytics" className="btn-outline">
          View analytics <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent events</h2>
          <Link
            href="/dashboard/events"
            className="text-sm text-brand-700 hover:underline"
          >
            View all
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="card grid place-items-center py-16 text-center">
            <p className="font-semibold">No events yet</p>
            <p className="mt-1 text-sm text-ink-muted">
              Create your first event to get started.
            </p>
            <Link href="/dashboard/events/create" className="btn-primary mt-4">
              Create event
            </Link>
          </div>
        ) : (
          <div className="card divide-y divide-white/5">
            {events.slice(0, 5).map((e) => (
              <Link
                key={e._id}
                href={`/dashboard/events/${e._id}/edit`}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02]"
              >
                <img
                  src={
                    e.bannerImage ||
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=70'
                  }
                  alt=""
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-semibold">{e.title}</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(e.startDate)}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">
                    {formatCurrency(e.stats?.revenue || 0)}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {e.stats?.tickets || 0} sold
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
