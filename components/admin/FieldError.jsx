'use client';

import { AlertCircle } from 'lucide-react';

/**
 * Tiny inline form-field error message.
 * Renders nothing when no error for `name`.
 */
export default function FieldError({ name, errors }) {
  const msg = errors?.[name];
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-700">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}
