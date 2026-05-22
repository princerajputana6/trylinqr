'use client';

import { useEffect } from 'react';

export default function ViewPing({ slug }) {
  useEffect(() => {
    fetch(`/api/events/${slug}/view`, { method: 'POST' }).catch(() => {});
  }, [slug]);
  return null;
}
