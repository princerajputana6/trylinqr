'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  Bell,
  Ticket,
  LayoutDashboard,
  User,
  LogOut,
  Compass,
  ChevronDown,
  Sparkles,
  LifeBuoy,
  Truck,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import HeaderLocationPicker from '@/components/layout/HeaderLocationPicker';
import HeaderSearchBar from '@/components/layout/HeaderSearchBar';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [cats, setCats] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    setOpen(false);
    setMenu(false);
    setCats(false);
  }, [pathname]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d) => setUnread(d.unread || 0))
      .catch(() => {});
  }, [session, pathname]);

  const role = session?.user?.role;
  const dashHref =
    role === 'superadmin'
      ? '/superadmin/dashboard'
      : role === 'admin'
      ? '/dashboard'
      : '/my-bookings';

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 !bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <nav className="container-page flex h-[68px] items-center gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-all"
        >
          <Image
            src="/trylinqr.png"
            alt="TryLinqr"
            width={150}
            height={42}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <NavLink
            href="/explore"
            label="Explore"
            active={pathname === '/explore'}
          />
          <div
            className="relative"
            onMouseEnter={() => setCats(true)}
            onMouseLeave={() => setCats(false)}
          >
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-obsidian/75 transition-colors hover:text-brand-700"
            >
              Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {cats && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full grid w-[420px] grid-cols-2 gap-1 rounded-2xl border border-ink-line bg-white p-2 shadow-elevated"
                >
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    return (
                      <Link
                        key={c.slug}
                        href={`/categories/${c.slug}`}
                        className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-obsidian/80 hover:bg-pearl hover:text-brand-700"
                      >
                        <span
                          className="grid h-7 w-7 place-items-center rounded-lg"
                          style={{ background: `${c.color}1F`, color: c.color }}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </span>
                        {c.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink
            href="/blogs"
            label="Blog"
            active={pathname.startsWith('/blogs')}
          />
          <NavLink
            href="/explore?price=free"
            label="Free Events"
          />
        </div>

        {/* combined location + search — right side */}
        <div className="ml-auto hidden flex-1 justify-end lg:flex">
          <HeaderSearchBar dark={false} />
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          {session ? (
            <>
              <Link
                href="/notifications"
                className="relative grid h-10 w-10 place-items-center rounded-xl text-obsidian/75 hover:bg-pearl"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setMenu((m) => !m)}
                  className="flex items-center gap-2 rounded-xl border border-ink-line bg-white py-1.5 pl-1.5 pr-3 text-obsidian hover:bg-pearl"
                >
                  <Avatar user={session.user} />
                  <span className="max-w-[100px] truncate text-sm font-semibold">
                    {session.user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink-line bg-white p-1.5 shadow-elevated"
                    >
                      <div className="border-b border-ink-line px-3 py-2">
                        <p className="text-sm font-semibold text-obsidian">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          {session.user.email}
                        </p>
                      </div>
                      <MenuItem href={dashHref} icon={LayoutDashboard}>
                        Dashboard
                      </MenuItem>
                      <MenuItem href="/my-bookings" icon={Ticket}>
                        My Bookings
                      </MenuItem>
                      <MenuItem href="/profile" icon={User}>
                        Profile
                      </MenuItem>
                      <MenuItem href="/bike-shipping" icon={Truck}>
                        Bike Shipping
                      </MenuItem>
                      <MenuItem href="/support" icon={LifeBuoy}>
                        Help & Support
                      </MenuItem>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-700/[0.06]"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-obsidian/75 hover:text-brand-700"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-800 hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl text-obsidian hover:bg-pearl lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-obsidian/50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[84vw] max-w-xs flex-col gap-1 bg-white p-4 lg:hidden"
            >
              <div className="mb-3 flex items-center justify-between">
                <Image
                  src="/trylinqr.png"
                  alt="TryLinqr"
                  width={130}
                  height={36}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-obsidian/70 hover:bg-pearl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-3">
                <HeaderLocationPicker />
              </div>
              <form onSubmit={submitSearch} className="mb-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search…"
                    className="input pl-9"
                  />
                </div>
              </form>
              <MobileItem href="/explore" icon={Compass}>
                Explore Events
              </MobileItem>
              <MobileItem href="/explore?price=free" icon={Sparkles}>
                Free Events
              </MobileItem>
              <MobileItem href="/bike-shipping" icon={Truck}>
                Bike Shipping
              </MobileItem>
              {session ? (
                <>
                  <MobileItem href={dashHref} icon={LayoutDashboard}>
                    Dashboard
                  </MobileItem>
                  <MobileItem href="/my-bookings" icon={Ticket}>
                    My Bookings
                  </MobileItem>
                  <MobileItem href="/profile" icon={User}>
                    Profile
                  </MobileItem>
                  <MobileItem href="/support" icon={LifeBuoy}>
                    Help & Support
                  </MobileItem>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-700/[0.06]"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <Link href="/login" className="btn-outline w-full">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary w-full">
                    Sign up
                  </Link>
                  <Link href="/admin-register" className="btn-sand w-full">
                    Become an organizer
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`group relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active ? 'text-brand-700' : 'text-obsidian/75 hover:text-brand-700'
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-700 transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}

function MenuItem({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-obsidian/85 hover:bg-pearl"
    >
      <Icon className="h-4 w-4 text-ink-muted" />
      {children}
    </Link>
  );
}

function MobileItem({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-obsidian/85 hover:bg-pearl"
    >
      <Icon className="h-4 w-4 text-ink-muted" />
      {children}
    </Link>
  );
}

export function Avatar({ user, size = 30 }) {
  const src =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || 'U'
    )}&background=710014&color=fff`;
  return (
    <img
      src={src}
      alt={user?.name || 'avatar'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover"
    />
  );
}
