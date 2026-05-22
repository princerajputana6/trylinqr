'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import AuthCard from '@/components/auth/AuthCard';
import { useToast } from '@/components/shared/Toast';

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (res?.error) {
      setBusy(false);
      return toast(res.error, 'error');
    }
    const session = await getSession();
    toast('Welcome back!', 'success');
    const callbackUrl = sp.get('callbackUrl');
    if (callbackUrl) router.push(callbackUrl);
    else if (session?.user?.role === 'superadmin')
      router.push('/superadmin/dashboard');
    else if (session?.user?.role === 'admin') router.push('/dashboard');
    else router.push('/my-bookings');
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to book events and manage your account"
      footer={
        <>
          New to TryLinqr?{' '}
          <Link href="/register" className="font-semibold text-brand-400">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
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
          <label className="label">Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button disabled={busy} className="btn-primary w-full">
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-ink-muted">
        Want to host events?{' '}
        <Link href="/admin-register" className="text-brand-400">
          Register as an organizer
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
