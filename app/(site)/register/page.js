'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/shared/PasswordInput';
import { useToast } from '@/components/shared/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.ok) {
      setBusy(false);
      return toast(data.error, 'error');
    }
    toast('Account created! Logging you in…', 'success');
    await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    router.push('/my-bookings');
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join TryLinqr and start booking events"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-400">
            Log in
          </Link>
        </>
      }
    >
      {/* Organizer CTA — sits at the top of the signup form */}
      <Link
        href="/admin-register"
        className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-brand-700/25 bg-brand-700/[0.05] px-4 py-3 transition-colors hover:bg-brand-700/[0.09]"
      >
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Hosting an event?
          </p>
          <p className="text-xs text-obsidian/70">
            Join as Organizer and start selling tickets in minutes →
          </p>
        </div>
      </Link>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <label className="label">Phone (optional)</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          {busy ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
    </AuthCard>
  );
}
