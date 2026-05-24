import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable layout for legal / informational pages.
 * Pass title, eyebrow, lastUpdated and children for the body content.
 * Renders a clean serif-feel article with the vintage paper aesthetic.
 */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  children,
}) {
  return (
    <div className="bg-pearl">
      <div className="container-page max-w-3xl py-12 sm:py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="border-b border-ink-line pb-8">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-obsidian sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-base leading-relaxed text-obsidian/70 sm:text-lg">
              {intro}
            </p>
          )}
          {lastUpdated && (
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-ink-muted">
              Last updated · {lastUpdated}
            </p>
          )}
        </header>

        <article className="legal-prose mt-10">{children}</article>
      </div>
    </div>
  );
}
