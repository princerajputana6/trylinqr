'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Mail, Phone, Building2 } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';

export default function AdminApprovalsPage() {
  const { toast } = useToast();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = () => {
    fetch('/api/admin/pending')
      .then((r) => r.json())
      .then((d) => {
        setPending(d.pending || []);
        setLoading(false);
      });
  };
  useEffect(load, []);

  const approve = async (id) => {
    setBusy(id);
    const res = await fetch(`/api/admin/${id}/approve`, { method: 'PUT' });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer approved', 'success');
    setPending((p) => p.filter((x) => x._id !== id));
  };

  const reject = async (id) => {
    const reason = prompt('Reason for rejection (optional):') || '';
    setBusy(id);
    const res = await fetch(`/api/admin/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer rejected', 'info');
    setPending((p) => p.filter((x) => x._id !== id));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold">
        Pending organizer approvals{' '}
        <span className="text-ink-muted">({pending.length})</span>
      </h2>

      {pending.length === 0 ? (
        <div className="card grid place-items-center py-20 text-center">
          <Check className="h-10 w-10 text-emerald-400" />
          <p className="mt-3 font-semibold">All caught up!</p>
          <p className="mt-1 text-sm text-ink-muted">
            No organizer applications waiting for review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-brand-400" />
                    <h3 className="text-lg font-bold">{u.orgName}</h3>
                  </div>
                  <p className="mt-1 text-sm text-white/80">{u.name}</p>
                  {u.orgDescription && (
                    <p className="mt-1 text-sm text-ink-muted">
                      {u.orgDescription}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {u.email}
                    </span>
                    {u.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {u.phone}
                      </span>
                    )}
                    <span>Applied {formatDate(u.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(u._id)}
                    disabled={busy === u._id}
                    className="btn-primary"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => reject(u._id)}
                    disabled={busy === u._id}
                    className="btn-outline text-brand-400"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
