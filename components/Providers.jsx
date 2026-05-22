'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/shared/Toast';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
