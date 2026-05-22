'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import TicketTierBuilder from '@/components/admin/TicketTierBuilder';
import { CATEGORIES, CITIES } from '@/lib/constants';
import { useToast } from '@/components/shared/Toast';

const STEPS = ['Basics', 'Date & Venue', 'Media', 'Tickets', 'Policies'];

function toDateInput(d) {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

export default function EventForm({ initial, eventId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || 'concert',
    subCategory: initial?.subCategory || '',
    description: initial?.description || '',
    startDate: toDateInput(initial?.startDate),
    endDate: toDateInput(initial?.endDate),
    startTime: initial?.startTime || '',
    endTime: initial?.endTime || '',
    venue: initial?.venue || {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      lat: '',
      lng: '',
    },
    bannerImage: initial?.bannerImage || '',
    galleryImages: initial?.galleryImages || [],
    promoVideo: initial?.promoVideo || '',
    ticketTiers: initial?.ticketTiers || [
      { name: 'General', price: 0, totalQuantity: 100, description: '', benefits: [] },
    ],
    tags: initial?.tags || [],
    ageRestriction: initial?.ageRestriction || '',
    dressCode: initial?.dressCode || '',
    cancellationPolicy: initial?.cancellationPolicy || '',
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setVenue = (key, value) =>
    setForm((f) => ({ ...f, venue: { ...f.venue, [key]: value } }));

  const validateStep = () => {
    if (step === 0 && !form.title.trim()) {
      toast('Event title is required', 'error');
      return false;
    }
    if (step === 1 && !form.startDate) {
      toast('Start date is required', 'error');
      return false;
    }
    if (step === 3) {
      if (form.ticketTiers.some((t) => !t.name.trim())) {
        toast('Every ticket tier needs a name', 'error');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = async (publish) => {
    if (!validateStep()) return;
    setBusy(true);
    const payload = { ...form, publish };
    const res = await fetch(
      eventId ? `/api/events/${eventId}` : '/api/events',
      {
        method: eventId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          eventId
            ? { ...form, status: publish ? 'pending' : 'draft' }
            : payload
        ),
      }
    );
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    toast(
      publish
        ? 'Event submitted for review'
        : eventId
        ? 'Event updated'
        : 'Draft saved',
      'success'
    );
    router.push('/dashboard/events');
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* stepper */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                  i < step
                    ? 'bg-brand-500 text-white'
                    : i === step
                    ? 'bg-brand-500/20 text-brand-400 ring-2 ring-brand-500'
                    : 'bg-white/5 text-ink-muted'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="mt-1 hidden text-xs text-ink-muted sm:block">
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 ${
                  i < step ? 'bg-brand-500' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="card p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {step === 0 && (
              <>
                <h2 className="text-lg font-bold">Basic information</h2>
                <div>
                  <label className="label">Event title</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={form.category}
                      onChange={(e) => set('category', e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.emoji} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Sub-category</label>
                    <input
                      className="input"
                      placeholder="Optional"
                      value={form.subCategory}
                      onChange={(e) => set('subCategory', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={5}
                    className="input resize-none"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input
                    className="input"
                    value={form.tags.join(', ')}
                    onChange={(e) =>
                      set(
                        'tags',
                        e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-lg font-bold">Date & venue</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Start date</label>
                    <input
                      type="date"
                      className="input"
                      value={form.startDate}
                      onChange={(e) => set('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">End date</label>
                    <input
                      type="date"
                      className="input"
                      value={form.endDate}
                      onChange={(e) => set('endDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Start time</label>
                    <input
                      type="time"
                      className="input"
                      value={form.startTime}
                      onChange={(e) => set('startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">End time</label>
                    <input
                      type="time"
                      className="input"
                      value={form.endTime}
                      onChange={(e) => set('endTime', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Venue name</label>
                  <input
                    className="input"
                    value={form.venue.name}
                    onChange={(e) => setVenue('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Address</label>
                  <input
                    className="input"
                    value={form.venue.address}
                    onChange={(e) => setVenue('address', e.target.value)}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">City</label>
                    <input
                      className="input"
                      list="cities"
                      value={form.venue.city}
                      onChange={(e) => setVenue('city', e.target.value)}
                    />
                    <datalist id="cities">
                      {CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      className="input"
                      value={form.venue.state}
                      onChange={(e) => setVenue('state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Pincode</label>
                    <input
                      className="input"
                      value={form.venue.pincode}
                      onChange={(e) => setVenue('pincode', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Latitude (optional)</label>
                    <input
                      type="number"
                      className="input"
                      value={form.venue.lat}
                      onChange={(e) => setVenue('lat', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Longitude (optional)</label>
                    <input
                      type="number"
                      className="input"
                      value={form.venue.lng}
                      onChange={(e) => setVenue('lng', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold">Media</h2>
                <ImageUploader
                  label="Banner image"
                  value={form.bannerImage}
                  onChange={(v) => set('bannerImage', v)}
                />
                <ImageUploader
                  label="Gallery images"
                  multiple
                  value={form.galleryImages}
                  onChange={(v) => set('galleryImages', v)}
                />
                <div>
                  <label className="label">Promo video URL (optional)</label>
                  <input
                    className="input"
                    value={form.promoVideo}
                    onChange={(e) => set('promoVideo', e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-bold">Ticket tiers</h2>
                <TicketTierBuilder
                  tiers={form.ticketTiers}
                  setTiers={(t) => set('ticketTiers', t)}
                />
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-lg font-bold">Policies & publish</h2>
                <div>
                  <label className="label">Age restriction</label>
                  <input
                    className="input"
                    placeholder="e.g. 18+"
                    value={form.ageRestriction}
                    onChange={(e) => set('ageRestriction', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Dress code</label>
                  <input
                    className="input"
                    value={form.dressCode}
                    onChange={(e) => set('dressCode', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Cancellation policy</label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    value={form.cancellationPolicy}
                    onChange={(e) =>
                      set('cancellationPolicy', e.target.value)
                    }
                  />
                </div>
                <p className="rounded-xl bg-white/5 p-3 text-sm text-ink-muted">
                  Submitting for review sends your event to a Super Admin for
                  approval. Saving as draft keeps it private.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={busy}
                className="btn-outline"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={busy}
                className="btn-primary"
              >
                {busy ? 'Saving…' : 'Submit for review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
