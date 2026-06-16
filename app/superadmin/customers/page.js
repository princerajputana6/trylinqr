'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ban, ShieldCheck, Trash2, Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 12;

function deriveStatus(u) {
  if (u.isBanned) return 'banned';
  if (u.role === 'admin' && !u.isApproved && u.rejectionReason) return 'rejected';
  if (u.role === 'admin' && !u.isApproved) return 'pending';
  return 'active';
}

const STATUS_PILL = {
  active:   'bg-emerald-100 text-emerald-700',
  pending:  'bg-amber-100 text-amber-700',
  rejected: 'bg-rose-100 text-rose-700',
  banned:   'bg-red-100 text-red-700',
};

function StatusPill({ user }) {
  const s = deriveStatus(user);
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_PILL[s]}`}>
      {s}
    </span>
  );
}

const ROLE_TABS = [
  { value: '',         label: 'All' },
  { value: 'customer', label: 'Customers' },
  { value: 'admin',    label: 'Organizers' },
];

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [role, search]);

  const load = () => {
    setLoading(true);
    fetch(`/api/superadmin/users${role ? `?role=${role}` : ''}`)
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false); });
  };
  useEffect(load, [role]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.orgName?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBan = async (u) => {
    const res = await fetch(`/api/superadmin/users/${u._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned: !u.isBanned }),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(data.message, 'success');
    setUsers((list) =>
      list.map((x) => (x._id === u._id ? { ...x, isBanned: !x.isBanned } : x))
    );
  };

  const remove = async (u) => {
    if (!confirm(`Permanently delete ${u.name || u.email}?\n\nThis cannot be undone.`)) return;
    const res = await fetch(`/api/superadmin/users/${u._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast('User deleted', 'success');
    setUsers((list) => list.filter((x) => x._id !== u._id));
  };

  return (
    <div className="space-y-4">
      {/* Filter + search row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {ROLE_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setRole(t.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                role === t.value
                  ? 'bg-brand-700 text-white shadow-glow-soft'
                  : 'bg-white border border-ink-line text-obsidian/70 hover:border-brand-700/40 hover:text-brand-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-line bg-pearl/50">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Role</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Joined</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-line">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-sm text-ink-muted">
                        {search ? 'No users match your search.' : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    paged.map((u, i) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.025 }}
                        className="group hover:bg-pearl/40"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-obsidian">{u.name}</p>
                          {u.role === 'admin' && u.orgName && (
                            <p className="text-xs text-ink-muted">{u.orgName}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-ink-muted">{u.email}</td>
                        <td className="px-5 py-3.5 capitalize text-obsidian/80">
                          {u.role === 'admin' ? 'Admin' : u.role === 'superadmin' ? 'Super Admin' : 'Customer'}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusPill user={u} />
                        </td>
                        <td className="px-5 py-3.5 text-sm text-ink-muted">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          {u.role !== 'superadmin' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleBan(u)}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  u.isBanned
                                    ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                }`}
                              >
                                {u.isBanned
                                  ? <><ShieldCheck className="h-3.5 w-3.5" /> Reinstate</>
                                  : <><Ban className="h-3.5 w-3.5" /> Ban</>}
                              </button>
                              <button
                                onClick={() => remove(u)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-ink-line px-5 py-3.5">
              <p className="text-sm text-ink-muted">
                Page <span className="font-semibold text-obsidian">{page}</span> of{' '}
                <span className="font-semibold text-obsidian">{totalPages}</span> ·{' '}
                <span className="font-semibold text-obsidian">{filtered.length}</span> items
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-sm text-ink-muted transition hover:bg-pearl disabled:opacity-40"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-medium transition ${
                        page === p
                          ? 'bg-brand-700 text-white shadow-glow-soft'
                          : 'border border-ink-line text-ink-muted hover:bg-pearl'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-sm text-ink-muted transition hover:bg-pearl disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
