'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Globe, Code2 } from 'lucide-react';

/**
 * Shows organizers how to embed an event on their own website.
 *
 * Two paths:
 *   1. This event only  → a single <iframe> snippet (works everywhere).
 *   2. Auto-embed       → install the /widget.js script once; every event
 *                         flagged "Show on my website" then appears
 *                         automatically (the Calendly / Google-Analytics model).
 */
function CopyBlock({ label, code, hint }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for non-secure contexts.
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy code
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-ink-line bg-pearl p-3 text-xs leading-relaxed text-obsidian">
        <code>{code}</code>
      </pre>
      {hint && <p className="mt-2 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export default function EmbedCodeModal({ event, open, onClose }) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  if (!event) return null;

  const orgId = String(event.organizer || '');
  const iframeCode = `<iframe
  src="${origin}/embed/${event.slug}"
  width="100%" height="360"
  frameborder="0" scrolling="no"
  style="border:0;max-width:420px"
></iframe>`;
  const scriptCode = `<script
  src="${origin}/widget.js"
  data-org-id="${orgId}"
></script>`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-obsidian/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Embed on your website</h3>
                <p className="mt-0.5 text-sm text-ink-muted line-clamp-1">
                  {event.title}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-pearl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-ink-line p-4">
                <div className="mb-3 flex items-center gap-2 text-brand-700">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    Option 1 — Just this event
                  </span>
                </div>
                <CopyBlock
                  label="Paste this one line anywhere on your site"
                  code={iframeCode}
                  hint="WordPress: a Custom HTML block · Wix/Webflow/Squarespace: an Embed/HTML element · React/Next.js: drop it in your JSX. Works on any platform."
                />
              </div>

              <div className="rounded-xl border border-brand-700/30 bg-brand-700/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-brand-700">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    Option 2 — Auto-show every event (install once)
                  </span>
                </div>
                <CopyBlock
                  label="Add this once to your site's <head>"
                  code={scriptCode}
                  hint='Install it a single time. After that, any event you toggle "Show on my website" appears automatically — no more copy-pasting.'
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
