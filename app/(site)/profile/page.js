'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Protected from '@/components/auth/Protected';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ImageUploader from '@/components/admin/ImageUploader';
import { Avatar } from '@/components/layout/Navbar';
import { useToast } from '@/components/shared/Toast';

function ProfileInner() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.json())
      .then((d) => d.ok && setUser(d.user));
  }, []);

  if (!user) return <LoadingSpinner full />;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    await update({ name: user.name, avatar: user.avatar });
    toast('Profile updated', 'success');
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="container-page max-w-2xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold">Profile</h1>
        <p className="mb-6 mt-1 text-sm text-ink-muted">
          Manage your account details
        </p>

        <div className="card mb-5 flex items-center gap-4 p-5">
          <Avatar user={user} size={64} />
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-ink-muted">{user.email}</p>
            <span className="chip mt-1 bg-brand-500/15 capitalize text-brand-400">
              {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={save} className="card space-y-4 p-5">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              value={user.name || ''}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={user.phone || ''}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>
          <ImageUploader
            label="Avatar"
            value={user.avatar}
            onChange={(v) => setUser({ ...user, avatar: v })}
          />

          {isAdmin && (
            <>
              <div>
                <label className="label">Organization name</label>
                <input
                  className="input"
                  value={user.orgName || ''}
                  onChange={(e) =>
                    setUser({ ...user, orgName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">About organization</label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={user.orgDescription || ''}
                  onChange={(e) =>
                    setUser({ ...user, orgDescription: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <button disabled={busy} className="btn-primary">
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  );
}
