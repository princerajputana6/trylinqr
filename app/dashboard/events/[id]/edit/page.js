'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function EditEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEvent(d.event);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner full />;
  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold">Edit event</h2>
      <EventForm initial={event} eventId={id} />
    </div>
  );
}
