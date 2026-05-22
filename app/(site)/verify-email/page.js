'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';

function VerifyInner() {
  const sp = useSearchParams();
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sp.get('token');
    const email = sp.get('email');
    if (!token || !email) {
      setState('error');
      setMessage('Invalid verification link.');
      return;
    }
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setState('success');
          setMessage(d.message);
        } else {
          setState('error');
          setMessage(d.error);
        }
      })
      .catch(() => {
        setState('error');
        setMessage('Something went wrong.');
      });
  }, [sp]);

  return (
    <AuthCard title="Email verification">
      <div className="flex flex-col items-center gap-3 text-center">
        {state === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-brand-400" />
            <p className="text-sm text-ink-muted">Verifying your email…</p>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="font-semibold">{message}</p>
            <Link href="/login" className="btn-primary mt-2 w-full">
              Continue to login
            </Link>
          </>
        )}
        {state === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-brand-400" />
            <p className="font-semibold">{message}</p>
            <Link href="/" className="btn-outline mt-2 w-full">
              Back to home
            </Link>
          </>
        )}
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
