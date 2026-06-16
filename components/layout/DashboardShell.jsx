'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, ChevronRight } from 'lucide-react';

const itemVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.25, ease: [0.4, 0, 0.2, 1] } }),
};

function NavItem({ item, pathname, onClick, index }) {
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <motion.div custom={index} variants={itemVariant} initial="hidden" animate="show">
      <Link
        href={item.href}
        onClick={onClick}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-brand-700 text-white shadow-glow-soft'
            : 'text-white/55 hover:bg-white/8 hover:text-white/90'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
        {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
      </Link>
    </motion.div>
  );
}

function SidebarContent({ nav, pathname, title, onClose }) {
  return (
    <div className="flex h-full flex-col">
      {/* Glow blob */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-700/25 blur-3xl" />

      {/* Logo */}
      <div className="relative flex items-center justify-between px-4 pt-5 pb-4">
        <Link href="/" onClick={onClose}>
          <div className="rounded-xl bg-white/10 px-3 py-2 transition hover:bg-white/15">
            <Image src="/trylinqr.png" alt="TryLinqr" width={110} height={30} className="h-6 w-auto" />
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="px-4 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">{title}</p>
      </div>
      <div className="mx-4 mb-3 h-px bg-white/8" />

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {nav.map((item, i) => (
          <NavItem key={item.href} item={item} pathname={pathname} onClick={onClose} index={i} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="mx-4 h-px bg-white/8" />
      <div className="space-y-0.5 px-3 py-3">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/45 transition hover:bg-white/8 hover:text-white/75"
        >
          <Home className="h-4 w-4" /> Back to site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-sand-300/60 transition hover:bg-white/8 hover:text-sand-300"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ title, nav, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeItem = nav.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)));

  return (
    <div className="min-h-screen bg-pearl">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-hidden border-r border-white/[0.07] bg-obsidian lg:flex lg:flex-col">
          <SidebarContent nav={nav} pathname={pathname} title={title} />
        </aside>

        {/* Main area */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-line bg-white/90 px-4 py-3 backdrop-blur-xl lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-obsidian transition hover:bg-pearl lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="hidden font-display text-xs font-semibold text-obsidian/35 lg:block">{title}</span>
              {activeItem && (
                <>
                  <ChevronRight className="hidden h-3 w-3 text-obsidian/25 lg:block" />
                  <h1 className="truncate font-display text-sm font-bold text-obsidian lg:text-[15px]">{activeItem.label}</h1>
                </>
              )}
              {!activeItem && <h1 className="truncate font-display text-sm font-bold text-obsidian lg:text-[15px]">{title}</h1>}
            </div>
          </div>

          {/* Page body */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="p-4 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="fixed left-0 top-0 z-50 h-full w-64 overflow-hidden border-r border-white/[0.07] bg-obsidian lg:hidden"
            >
              <SidebarContent nav={nav} pathname={pathname} title={title} onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
