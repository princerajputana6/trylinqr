'use client';

import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  Users,
  Ticket,
  Grid3x3,
  Settings,
} from 'lucide-react';
import Protected from '@/components/auth/Protected';
import DashboardShell from '@/components/layout/DashboardShell';

const NAV = [
  { href: '/superadmin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/superadmin/admins', label: 'Organizer Approvals', icon: UserCheck },
  { href: '/superadmin/events', label: 'All Events', icon: CalendarDays },
  { href: '/superadmin/customers', label: 'Users', icon: Users },
  { href: '/superadmin/bookings', label: 'Bookings', icon: Ticket },
  { href: '/superadmin/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/superadmin/settings', label: 'Settings', icon: Settings },
];

export default function SuperadminLayout({ children }) {
  return (
    <Protected roles={['superadmin']}>
      <DashboardShell title="Super Admin" nav={NAV}>
        {children}
      </DashboardShell>
    </Protected>
  );
}
