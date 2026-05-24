import TicketQueue from '@/components/support/TicketQueue';

export const dynamic = 'force-dynamic';

export default function SuperadminSupportPage() {
  return (
    <TicketQueue
      apiPath="/api/superadmin/support"
      basePath="/superadmin/support"
      title="All support tickets"
    />
  );
}
