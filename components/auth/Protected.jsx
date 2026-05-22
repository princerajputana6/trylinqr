'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Protected({ roles, children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && !roles.includes(session.user.role)) {
      router.replace('/');
    }
  }, [session, status, roles, router, pathname]);

  if (status === 'loading' || !session) {
    return <LoadingSpinner full />;
  }
  if (roles && !roles.includes(session.user.role)) {
    return <LoadingSpinner full label="Redirecting…" />;
  }
  return children;
}
