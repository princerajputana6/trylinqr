'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trash2, MoreVertical, Search, Pencil, ShieldBan, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';

function deriveStatus(u) {
  if (u.isBanned) return 'banned';
  if (u.isApproved) return 'active';
  if (u.rejectionReason) return 'rejected';
  return 'pending';
}

const STATUS_CONFIG = {
  active:   { label: 'Active',   dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending:  { label: 'Pending',  dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  rejected: { label: 'Rejected', dot: 'bg-rose-400',    pill: 'bg-rose-50 text-rose-700 border-rose-200' },
  banned:   { label: 'Banned',   dot: 'bg-red-500',     pill: 'bg-red-50 text-red-700 border-red-200' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, avatar }) {
  return avatar ? (
    <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
  ) : (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700/10 text-sm font-bold text-brand-700">
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function ActionMenu({ user, onApprove, onReject, onBan, onUnban, onDelete, busy }) {
  const [open, setOpen] = useState(false);
  const status = deriveStatus(user);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-8 w-8 place-items-center rounded-lg text-obsidian/40 transition hover:bg-pearl hover:text-obsidian"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-9 z-20 min-w-[170px] rounded-xl border border-ink-line bg-white py-1 shadow-elevated"
            >
              {status === 'pending' && (
                <>
                  <button
                    onClick={() => { setOpen(false); onApprove(user._id); }}
                    disabled={busy === user._id}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => { setOpen(false); onReject(user._id); }}
                    disabled={busy === user._id}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
              {status === 'active' && (
                <button
                  onClick={() => { setOpen(false); onBan(user._id); }}
                  disabled={busy === user._id}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <ShieldBan className="h-3.5 w-3.5" /> Ban
                </button>
              )}
              {status === 'banned' && (
                <button
                  onClick={() => { setOpen(false); onUnban(user._id); }}
                  disabled={busy === user._id}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Unban
                </button>
              )}
              {status === 'rejected' && (
                <button
                  onClick={() => { setOpen(false); onApprove(user._id); }}
                  disabled={busy === user._id}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  <Check className="h-3.5 w-3.5" /> Re-approve
                </button>
              )}
              <div className="mx-3 my-1 h-px bg-ink-line" />
              <button
                onClick={() => { setOpen(false); onDelete(user); }}
                disabled={busy === user._id}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-brand-700 hover:bg-brand-700/5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const TABS = ['all', 'active', 'pending', 'banned', 'rejected'];

export default function AdminApprovalsPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const load = () => {
    fetch('/api/superadmin/users?role=admin')
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false); });
  };
  useEffect(load, []);

  const counts = useMemo(() => {
    const c = { all: users.length };
    users.forEach((u) => {
      const s = deriveStatus(u);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    let list = tab === 'all' ? users : users.filter((u) => deriveStatus(u) === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.orgName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, tab, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [tab, search]);

  const approve = async (id) => {
    setBusy(id);
    const res = await fetch(`/api/admin/${id}/approve`, { method: 'PUT' });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer approved', 'success');
    setUsers((u) => u.map((x) => x._id === id ? { ...x, isApproved: true, isBanned: false, rejectionReason: '' } : x));
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
    setUsers((u) => u.map((x) => x._id === id ? { ...x, isApproved: false, rejectionReason: reason || 'Did not meet criteria' } : x));
  };

  const ban = async (id) => {
    setBusy(id);
    const res = await fetch(`/api/superadmin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned: true }),
    });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer banned', 'success');
    setUsers((u) => u.map((x) => x._id === id ? { ...x, isBanned: true } : x));
  };

  const unban = async (id) => {
    setBusy(id);
    const res = await fetch(`/api/superadmin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned: false }),
    });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer reinstated', 'success');
    setUsers((u) => u.map((x) => x._id === id ? { ...x, isBanned: false } : x));
  };

  const remove = async (u) => {
    if (!confirm(`Permanently delete ${u.orgName || u.name}?\n\nTheir active events will be cancelled. This cannot be undone.`)) return;
    setBusy(u._id);
    const res = await fetch(`/api/superadmin/users/${u._id}`, { method: 'DELETE' });
    const data = await res.json();
    setBusy(null);
    if (!data.ok) return toast(data.error, 'error');
    toast('Organizer deleted', 'success');
    setUsers((prev) => prev.filter((x) => x._id !== u._id));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="border-b border-ink-line">
        <div className="no-scrollbar flex gap-0 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t;
            const n = counts[t] || 0;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  active ? 'text-obsidian' : 'text-ink-muted hover:text-obsidian'
                }`}
              >
                {t}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? 'bg-obsidian text-white' : 'bg-pearl text-obsidian/60'
                  }`}
                >
                  {n}
                </span>
                {active && (
                  <motion.div
                    layoutId="admin-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-obsidian"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filter row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            className="input pl-9"
            placeholder="Search by name, email or org…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ink-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink-line">
            <thead>
              <tr className="bg-pearl/60">
                <th className="w-8 px-4 py-3" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Organisation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Applied</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Status</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-ink-muted">
                    {search ? 'No results matching your search.' : 'No organizers in this category.'}
                  </td>
                </tr>
              ) : (
                paged.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-pearl/40"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-ink-line" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} avatar={u.avatar} />
                        <div>
                          <p className="font-semibold text-obsidian">{u.name}</p>
                          <p className="text-xs text-ink-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-obsidian/80">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-obsidian/80">{u.orgName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={deriveStatus(u)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-obsidian/40 transition hover:bg-pearl hover:text-obsidian">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <ActionMenu
                          user={u}
                          onApprove={approve}
                          onReject={reject}
                          onBan={ban}
                          onUnban={unban}
                          onDelete={remove}
                          busy={busy}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between border-t border-ink-line px-4 py-3">
          <p className="text-sm text-ink-muted">
            {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-8 w-8 place-items-center rounded-lg text-sm text-ink-muted transition hover:bg-pearl disabled:opacity-40"
            >
              ‹
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="grid h-8 w-8 place-items-center rounded-lg text-sm text-ink-muted transition hover:bg-pearl disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
