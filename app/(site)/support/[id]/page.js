'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TicketThread from '@/components/support/TicketThread';
import { useToast } from '@/components/shared/Toast';

export default function CustomerTicketPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/support/tickets/${params.id}`);
    const data = await res.json();
    if (!data.ok) {
      toast(data.error || 'Failed to load ticket', 'error');
      router.push('/support');
      return;
    }
    setTicket(data.ticket);
    setLoading(false);
  }, [params.id, router, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner full />;
  if (!ticket) return null;

  return (
    <div className="container-page py-8">
      <Link
        href="/support"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to support
      </Link>
      <TicketThread ticket={ticket} viewerRole="customer" basePath="/support" />
    </div>
  );
}
