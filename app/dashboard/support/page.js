'use client';

import Link from 'next/link';
import { Plus, LifeBuoy } from 'lucide-react';
import TicketQueue from '@/components/support/TicketQueue';

export const dynamic = 'force-dynamic';

export default function OrganizerSupportPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-obsidian">
              Organizer support
            </h1>
            <p className="text-sm text-obsidian/65">
              Tickets the platform team has forwarded to you — plus your own
              raised tickets.
            </p>
          </div>
        </div>
        <Link href="/support/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Raise a ticket
        </Link>
      </div>

      <TicketQueue
        apiPath="/api/admin/support"
        basePath="/dashboard/support"
        title="Forwarded to you"
      />
    </div>
  );
}
