'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Stars from '@/components/shared/Stars';
import { Avatar } from '@/components/layout/Navbar';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';

export default function ReviewSection({ eventId, initialReviews }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const alreadyReviewed = reviews.some(
    (r) => String(r.customer?._id) === session?.user?.id
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast('Pick a rating first', 'error');
    setBusy(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, rating, comment }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    setReviews((r) => [
      {
        ...data.review,
        customer: { name: session.user.name, avatar: session.user.avatar },
      },
      ...r,
    ]);
    setRating(0);
    setComment('');
    toast('Review posted — thank you!', 'success');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">
        Reviews{' '}
        <span className="text-ink-muted">({reviews.length})</span>
      </h2>

      {session && !alreadyReviewed && (
        <form onSubmit={submit} className="card mb-6 space-y-3 p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-muted">Your rating</span>
            <Stars value={rating} size={22} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience…"
            className="input resize-none"
          />
          <button disabled={busy} className="btn-primary">
            {busy ? 'Posting…' : 'Post review'}
          </button>
          <p className="text-xs text-ink-muted">
            Only attendees who booked this event can review.
          </p>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No reviews yet — be the first to review after attending.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar user={r.customer} size={36} />
                <div>
                  <p className="text-sm font-semibold">
                    {r.customer?.name || 'Attendee'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} />
                    <span className="text-xs text-ink-muted">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              {r.comment && (
                <p className="mt-2 text-sm text-obsidian/80">{r.comment}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
