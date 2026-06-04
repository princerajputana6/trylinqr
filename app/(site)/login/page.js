'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/shared/PasswordInput';
import { useToast } from '@/components/shared/Toast';

function LoginInner() {
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

    // Decide where to send the user.
    const callbackUrl = sp.get('callbackUrl');
    let target;
    if (callbackUrl && callbackUrl !== '/login') {
      target = callbackUrl;
    } else if (session?.user?.role === 'superadmin') {
      target = '/superadmin/dashboard';
    } else if (session?.user?.role === 'admin') {
      target = '/dashboard';
    } else {
      target = '/my-bookings';
    }

    // IMPORTANT: hard-navigate, not router.push.
    // The NextAuth session cookie was set on the signIn response, but
    // router.push does a soft client navigation that triggers Edge middleware
    // before the cookie is reliably attached to the next request —
    // middleware then sees no token and bounces back to /login?callbackUrl=…
    // A full page load guarantees the cookie ships with the request.
    window.location.assign(target);
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
          <PasswordInput
            required
            autoComplete="current-password"
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
