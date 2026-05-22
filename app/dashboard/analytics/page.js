'use client';

import { useEffect, useState } from 'react';
import {
  IndianRupee,
  Ticket,
  CalendarCheck,
  Eye,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { BarChartCard, LineChartCard } from '@/components/admin/AnalyticsChart';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (!data) return <p>No analytics available.</p>;

  const { stats, revenueByEvent, bookingsTrend } = data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={IndianRupee}
          label="Gross revenue"
          value={stats.totalRevenue}
          prefix="₹"
          accent="#22c55e"
          index={0}
        />
        <StatCard
          icon={IndianRupee}
          label="Net (after fees)"
          value={stats.netRevenue}
          prefix="₹"
          accent="#06b6d4"
          index={1}
        />
        <StatCard
          icon={Ticket}
          label="Tickets sold"
          value={stats.totalTickets}
          accent="#8b5cf6"
          index={2}
        />
        <StatCard
          icon={CalendarCheck}
          label="Published events"
          value={stats.publishedEvents}
          accent="#e63e62"
          index={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-bold">Bookings — last 7 days</h3>
          {bookingsTrend?.length ? (
            <LineChartCard data={bookingsTrend} xKey="day" lineKey="bookings" />
          ) : (
            <Empty />
          )}
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-bold">Revenue by event</h3>
          {revenueByEvent?.length ? (
            <BarChartCard
              data={revenueByEvent}
              xKey="name"
              barKey="revenue"
              color="#22c55e"
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="grid h-[260px] place-items-center text-sm text-ink-muted">
      Not enough data yet.
    </div>
  );
}
