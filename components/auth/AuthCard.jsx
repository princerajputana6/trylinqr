'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-7"
      >
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center justify-center">
          <Image
            src="/trylinqr.png"
            alt="TryLinqr"
            width={160}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <h1 className="text-center font-display text-2xl font-extrabold text-obsidian">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-ink-muted">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
        {footer && (
          <div className="mt-5 text-center text-sm text-ink-muted">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
