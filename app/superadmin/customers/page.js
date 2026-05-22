'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, ShieldCheck, Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`/api/superadmin/users${role ? `?role=${role}` : ''}`)
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      });
  };
  useEffect(load, [role]);

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

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {[
            { v: '', l: 'All' },
            { v: 'customer', l: 'Customers' },
            { v: 'admin', l: 'Organizers' },
          ].map((r) => (
            <button
              key={r.v}
              onClick={() => setRole(r.v)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                role === r.v
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {r.l}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="input pl-9"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase text-ink-muted">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5"
                >
                  <td className="p-3 font-medium">
                    {u.name}
                    {u.role === 'admin' && u.orgName && (
                      <span className="block text-xs text-ink-muted">
                        {u.orgName}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-ink-muted">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.isBanned ? (
                      <span className="chip bg-brand-500/15 text-brand-400">
                        Banned
                      </span>
                    ) : u.role === 'admin' && !u.isApproved ? (
                      <span className="chip bg-amber-500/15 text-amber-400">
                        Pending
                      </span>
                    ) : (
                      <span className="chip bg-emerald-500/15 text-emerald-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-xs text-ink-muted">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-3">
                    {u.role !== 'superadmin' && (
                      <button
                        onClick={() => toggleBan(u)}
                        className={`btn-outline px-3 py-1.5 text-xs ${
                          u.isBanned ? '' : 'text-brand-400'
                        }`}
                      >
                        {u.isBanned ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" /> Reinstate
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" /> Ban
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
