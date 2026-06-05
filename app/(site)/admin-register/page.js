'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/shared/PasswordInput';
import { useToast } from '@/components/shared/Toast';

export default function AdminRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    orgName: '',
    orgDescription: '',
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/auth/admin-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard
        title="Application received"
        subtitle="Your organizer account is pending approval"
      >
        <p className="text-center text-sm text-white/80">
          Our team will review your application shortly. You'll get an email
          once your account is approved — then you can log in and start
          creating events.
        </p>
        <Link href="/login" className="btn-primary mt-6 w-full">
          Go to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Become an organizer"
      subtitle="Host events of any kind on TryLinqr"
      footer={
        <>
          Just want to book events?{' '}
          <Link href="/register" className="font-semibold text-brand-400">
            Customer sign up
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Your name</label>
            <input
              required
              maxLength={60}
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              inputMode="tel"
              maxLength={15}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label flex items-center justify-between gap-2">
            <span>Organization / brand name</span>
            <span className="text-[11px] font-normal text-ink-muted">
              {form.orgName.length}/80
            </span>
          </label>
          <input
            required
            maxLength={80}
            className="input"
            value={form.orgName}
            onChange={(e) => setForm({ ...form, orgName: e.target.value })}
          />
        </div>
        <div>
          <label className="label flex items-center justify-between gap-2">
            <span>About your organization</span>
            <span className="text-[11px] font-normal text-ink-muted">
              {(form.orgDescription || '').length}/500
            </span>
          </label>
          <textarea
            rows={2}
            maxLength={500}
            className="input resize-none"
            value={form.orgDescription}
            onChange={(e) =>
              setForm({ ...form, orgDescription: e.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordInput
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </AuthCard>
  );
}
