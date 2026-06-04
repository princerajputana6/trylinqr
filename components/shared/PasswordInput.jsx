'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Password input with a show/hide eye toggle.
 *
 * Pass through every native <input> prop (value, onChange, required,
 * autoComplete, placeholder, name, id, etc.). The wrapper renders the field
 * with a button on the right that flips type=password ↔ type=text.
 *
 * Uses the same `.input` class as the rest of the app so it matches the
 * existing form styling — just adds room on the right for the icon.
 */
export default function PasswordInput({
  className = '',
  autoComplete = 'current-password',
  ...rest
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...rest}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        className={`input pr-11 ${className}`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-ink-muted transition-colors hover:bg-pearl hover:text-brand-700"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
