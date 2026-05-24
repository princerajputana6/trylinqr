import TicketQueue from '@/components/support/TicketQueue';

export const dynamic = 'force-dynamic';

export default function OrganizerSupportPage() {
  return (
    <TicketQueue
      apiPath="/api/admin/support"
      basePath="/dashboard/support"
      title="Tickets forwarded to you"
    />
  );
}
