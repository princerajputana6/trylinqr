'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarDays,
  Ticket,
  IndianRupee,
  UserCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { PieChartCard } from '@/components/admin/AnalyticsChart';

export default function SuperadminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/superadmin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (!data) return <p>No data.</p>;

  const { stats, eventsByCategory } = data;

  return (
    <div className="space-y-8">
      {(stats.pendingAdmins > 0 || stats.pendingEvents > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.pendingAdmins > 0 && (
            <Link
              href="/superadmin/admins"
              className="card flex items-center gap-3 p-4 hover:border-brand-700/40"
            >
              <UserCheck className="h-5 w-5 text-amber-400" />
              <span className="text-sm">
                <b>{stats.pendingAdmins}</b> organizer
                {stats.pendingAdmins > 1 ? 's' : ''} awaiting approval
              </span>
              <ArrowRight className="h-4 w-4 text-ink-muted" />
            </Link>
          )}
          {stats.pendingEvents > 0 && (
            <Link
              href="/superadmin/events?status=pending"
              className="card flex items-center gap-3 p-4 hover:border-brand-700/40"
            >
              <Clock className="h-5 w-5 text-amber-400" />
              <span className="text-sm">
                <b>{stats.pendingEvents}</b> event
                {stats.pendingEvents > 1 ? 's' : ''} pending review
              </span>
              <ArrowRight className="h-4 w-4 text-ink-muted" />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} accent="#3b82f6" index={0} />
        <StatCard icon={CalendarDays} label="Total events" value={stats.totalEvents} accent="#e63e62" index={1} />
        <StatCard icon={Ticket} label="Total bookings" value={stats.totalBookings} accent="#8b5cf6" index={2} />
        <StatCard icon={IndianRupee} label="Platform earnings" value={stats.platformEarnings} prefix="₹" accent="#22c55e" index={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Customers" value={stats.customers} accent="#06b6d4" index={0} />
        <StatCard icon={UserCheck} label="Organizers" value={stats.admins} accent="#f97316" index={1} />
        <StatCard icon={CalendarDays} label="Published events" value={stats.publishedEvents} accent="#22c55e" index={2} />
        <StatCard icon={IndianRupee} label="Gross revenue" value={stats.totalRevenue} prefix="₹" accent="#eab308" index={3} />
      </div>

      <div className="card p-5">
        <h3 className="mb-4 font-bold">Events by category</h3>
        {eventsByCategory?.length ? (
          <PieChartCard data={eventsByCategory} />
        ) : (
          <div className="grid h-[260px] place-items-center text-sm text-ink-muted">
            No events yet.
          </div>
        )}
      </div>
    </div>
  );
}
