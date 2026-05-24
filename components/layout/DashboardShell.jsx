'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home } from 'lucide-react';

export default function DashboardShell({ title, nav, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarBody = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-brand-700 text-white shadow-glow-soft'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-pearl">
      <div className="flex">
        {/* desktop sidebar — obsidian dark */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-obsidian-line bg-obsidian p-4 lg:flex">
          <Link href="/" className="mb-6 flex w-fit items-center rounded-xl bg-white px-3 py-2 shadow-card">
            <Image
              src="/trylinqr.png"
              alt="TryLinqr"
              width={130}
              height={36}
              className="h-7 w-auto"
            />
          </Link>
          {SidebarBody}
          <div className="mt-auto flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              <Home className="h-4 w-4" /> Back to site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-400 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-line bg-white/85 px-4 py-3 backdrop-blur-xl lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-obsidian hover:bg-pearl lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold text-obsidian">{title}</h1>
          </div>
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-obsidian/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-obsidian-line bg-obsidian p-4 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="rounded-lg bg-white px-2.5 py-1.5">
                  <Image
                    src="/trylinqr.png"
                    alt="TryLinqr"
                    width={120}
                    height={32}
                    className="h-6 w-auto"
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {SidebarBody}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-400 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
