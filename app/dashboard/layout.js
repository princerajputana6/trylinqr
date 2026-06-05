'use client';

import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Ticket,
  BarChart3,
  UserCircle,
  LifeBuoy,
  Landmark,
} from 'lucide-react';
import Protected from '@/components/auth/Protected';
import DashboardShell from '@/components/layout/DashboardShell';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/events', label: 'My Events', icon: CalendarDays },
  { href: '/dashboard/events/create', label: 'Create Event', icon: CalendarPlus },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Ticket },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/payouts', label: 'Payouts', icon: Landmark },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function DashboardLayout({ children }) {
  return (
    <Protected roles={['admin', 'superadmin']}>
      <DashboardShell title="Organizer Dashboard" nav={NAV}>
        {children}
      </DashboardShell>
    </Protected>
  );
}
