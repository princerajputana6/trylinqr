'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import Protected from '@/components/auth/Protected';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatDateTime } from '@/lib/utils';

function NotificationsInner() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.notifications || []);
        setLoading(false);
      });
  }, []);

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setItems((i) => i.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="container-page max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Notifications</h1>
        {items.some((n) => !n.isRead) && (
          <button onClick={markAll} className="btn-ghost text-sm">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card grid place-items-center py-20 text-center">
          <Bell className="h-10 w-10 text-ink-muted" />
          <p className="mt-3 font-semibold">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={n.link || '#'}>
                <div
                  className={`card flex items-start gap-3 p-4 ${
                    n.isRead ? '' : 'border-brand-500/40 bg-brand-500/5'
                  }`}
                >
                  {!n.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  )}
                  <div className={n.isRead ? 'ml-5' : ''}>
                    <p className="text-sm">{n.message}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Protected>
      <NotificationsInner />
    </Protected>
  );
}
