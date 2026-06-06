'use client';

/**
 * 12-hour AM/PM time picker.
 *
 * Internally stores the value as a 24-hour "HH:MM" string (the same format
 * native <input type="time"> uses), so it's a drop-in replacement for the
 * existing form fields and the API/DB don't change.
 *
 * Renders three inline selects: Hour (1–12) · Minute (00–55 in 5-min steps)
 * · AM/PM. Keeping it three native <select>s gives us a clean tap experience
 * on mobile and zero extra deps.
 *
 * Props:
 *   value      — "HH:MM" 24h string (e.g. "17:30") OR empty.
 *   onChange   — fn(newValue: "HH:MM") called whenever any part changes.
 *   minuteStep — 1, 5, 10, 15, 30 (default 5).
 *   className  — extra classes on the wrapping div.
 *   ariaInvalid— passed to each select for a11y/error styling.
 */
export default function TimePicker12h({
  value = '',
  onChange,
  minuteStep = 5,
  className = '',
  ariaInvalid = false,
}) {
  const parsed = parseTime(value);
  const hour12 = parsed.hour24 === 0 ? 12 : parsed.hour24 > 12 ? parsed.hour24 - 12 : parsed.hour24;
  const ampm = parsed.hour24 >= 12 ? 'PM' : 'AM';

  const emit = (h12, mm, ap) => {
    let h24 = Number(h12);
    if (ap === 'AM') {
      if (h24 === 12) h24 = 0;
    } else {
      if (h24 !== 12) h24 += 12;
    }
    const hh = String(h24).padStart(2, '0');
    const mins = String(mm).padStart(2, '0');
    onChange?.(`${hh}:${mins}`);
  };

  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
  const minuteOptions = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => i * minuteStep,
  );

  // common select styling matches .input but tighter
  const sel =
    'rounded-xl border border-obsidian/10 bg-white px-2.5 py-2.5 text-sm text-obsidian ' +
    'focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15';
  const errSel = ariaInvalid
    ? ' border-brand-700 focus:ring-brand-700/20'
    : '';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        aria-label="Hour"
        aria-invalid={ariaInvalid}
        className={sel + errSel}
        value={hour12 || 12}
        onChange={(e) => emit(e.target.value, parsed.minute, ampm)}
      >
        {hourOptions.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-sm font-semibold text-obsidian/55">:</span>
      <select
        aria-label="Minute"
        aria-invalid={ariaInvalid}
        className={sel + errSel}
        value={parsed.minute}
        onChange={(e) => emit(hour12 || 12, e.target.value, ampm)}
      >
        {minuteOptions.map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, '0')}
          </option>
        ))}
      </select>
      <select
        aria-label="AM or PM"
        aria-invalid={ariaInvalid}
        className={sel + errSel}
        value={ampm}
        onChange={(e) => emit(hour12 || 12, parsed.minute, e.target.value)}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

function parseTime(v) {
  if (!v || typeof v !== 'string') return { hour24: 0, minute: 0 };
  // Accept "HH:MM" 24h ("17:30") OR "h:mm AM/PM" ("5:30 PM").
  const ampmMatch = v.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let h = Number(ampmMatch[1]) % 12;
    if (/PM/i.test(ampmMatch[3])) h += 12;
    return { hour24: h, minute: Number(ampmMatch[2]) };
  }
  const m = v.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return { hour24: 0, minute: 0 };
  return { hour24: Number(m[1]), minute: Number(m[2]) };
}
