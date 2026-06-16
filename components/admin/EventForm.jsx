'use client';

import { useEffect, useState } from 'react';
import { haversineKm } from '@/lib/bikeShipping';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Bike,
  ShieldCheck,
  HardHat,
  Fuel,
  Mountain,
  Users,
  ClipboardList,
  Sparkles,
  Globe,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import TicketTierBuilder from '@/components/admin/TicketTierBuilder';
import LocationPicker from '@/components/shared/LocationPicker';
import {
  CATEGORIES,
  CITIES,
  RIDE_DOCUMENTS,
  RIDE_GEARS,
  RIDE_DIFFICULTY,
} from '@/lib/constants';
import { SUB_CATEGORIES, suggestTags } from '@/lib/eventTaxonomy';
import { useToast } from '@/components/shared/Toast';
import FieldError from '@/components/admin/FieldError';
import PromotionPicker from '@/components/admin/PromotionPicker';
import TimePicker12h from '@/components/admin/TimePicker12h';
import PromotionSelector from '@/components/admin/PromotionSelector';

function buildSteps(category) {
  const steps = ['Basics', 'Date & Venue', 'Media', 'Tickets', 'Policies'];
  if (category === 'bike-ride') steps.splice(2, 0, 'Ride Details');
  return steps;
}

function toDateInput(d) {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

export default function EventForm({ initial, eventId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [savedEventId, setSavedEventId] = useState(eventId);

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
      // Empty numeric defaults — let the user type, validate on submit.
      { name: '', price: '', totalQuantity: '', description: '', benefits: [] },
    ],
    isFeatured: initial?.isFeatured || false,
    showOnOrgSite: initial?.showOnOrgSite || false,
    tags: initial?.tags || [],
    ageRestriction: initial?.ageRestriction || '',
    dressCode: initial?.dressCode || '',
    cancellationPolicy: initial?.cancellationPolicy || '',
    rideDetails: initial?.rideDetails || {
      meetupTime: '',
      rideStartTime: '',
      rideTill: '',
      destination: { name: '', address: '', city: '', state: '', country: '', pincode: '', lat: '', lng: '' },
      distanceKm: '',
      durationDays: '',
      difficulty: '',
      pillionAllowed: true,
      mandatoryDocuments: [...RIDE_DOCUMENTS],
      mandatoryGears: ['Helmet', 'Gloves'],
      fuelPolicy: '',
      inclusions: [],
      rideNotes: '',
    },
  });

  const STEPS = buildSteps(form.category);
  const current = STEPS[step] || STEPS[0];
  // clamp step if category change shrinks the array
  if (step > STEPS.length - 1) setStep(STEPS.length - 1);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setVenue = (key, value) =>
    setForm((f) => ({ ...f, venue: { ...f.venue, [key]: value } }));

  // Track whether the organizer has manually edited distance/duration so
  // we don't keep overwriting their value once they take control.
  const [touched, setTouched] = useState({ distanceKm: false, durationDays: false });

  // Auto-fill distance + duration from coordinates whenever both ends have
  // lat/lng AND the user hasn't manually overridden the values.
  useEffect(() => {
    if (form.category !== 'bike-ride') return;
    const v = form.venue || {};
    const d = form.rideDetails?.destination || {};
    if (!v.lat || !v.lng || !d.lat || !d.lng) return;
    const km = haversineKm(
      { lat: Number(v.lat), lng: Number(v.lng) },
      { lat: Number(d.lat), lng: Number(d.lng) },
    );
    if (!isFinite(km) || km <= 0) return;
    // Road distance is roughly 1.25–1.4× straight-line — bias up a bit so
    // the suggestion is closer to actual riding distance.
    const roadKm = Math.round(km * 1.3);
    // Rough day estimate: a comfortable ride day is ~300 km on Indian
    // highways. 1 day for ≤300, 2 days for ≤600, etc.
    const days = Math.max(1, Math.ceil(roadKm / 300));

    setForm((f) => {
      const next = { ...f, rideDetails: { ...f.rideDetails } };
      if (!touched.distanceKm) next.rideDetails.distanceKm = String(roadKm);
      if (!touched.durationDays) next.rideDetails.durationDays = String(days);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.category,
    form.venue?.lat,
    form.venue?.lng,
    form.rideDetails?.destination?.lat,
    form.rideDetails?.destination?.lng,
    touched.distanceKm,
    touched.durationDays,
  ]);
  const setRide = (key, value) =>
    setForm((f) => ({ ...f, rideDetails: { ...f.rideDetails, [key]: value } }));
  const toggleInList = (key, value) =>
    setForm((f) => {
      const cur = f.rideDetails[key] || [];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...f, rideDetails: { ...f.rideDetails, [key]: next } };
    });

  // ── Field-level validation ──
  // Returns a flat { fieldPath: 'error message' } object.
  // Keys use dot-paths for nested objects (e.g. 'venue.city').
  // Empty object = step is valid.
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const e = {};
    if (current === 'Basics') {
      if (!form.title.trim()) e.title = 'Event title is required';
      else if (form.title.trim().length < 4)
        e.title = 'Title must be at least 4 characters';
      else if (form.title.length > 120)
        e.title = 'Title must be 120 characters or fewer';
      if (!form.category) e.category = 'Pick a category';
      if (!form.description?.trim())
        e.description = 'A short description is required';
      else if (form.description.trim().length < 20)
        e.description =
          'Description must be at least 20 characters so attendees know what to expect';
    }
    if (current === 'Date & Venue') {
      if (!form.startDate) e.startDate = 'Start date is required';
      else {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const sd = new Date(form.startDate);
        if (sd < today) e.startDate = 'Start date cannot be in the past';
      }
      if (form.endDate && form.startDate) {
        if (new Date(form.endDate) < new Date(form.startDate))
          e.endDate = 'End date cannot be before the start date';
      }
      if (form.startTime && !/^\d{1,2}:\d{2}( ?[APap][Mm])?$/.test(form.startTime))
        e.startTime = 'Use HH:MM (e.g. 19:30)';
      if (!form.venue?.city?.trim()) e['venue.city'] = 'City is required';
      if (!form.venue?.name?.trim())
        e['venue.name'] = 'Venue name is required (or type "Online")';
      if (
        form.venue?.pincode &&
        !/^\d{6}$/.test(String(form.venue.pincode).trim())
      )
        e['venue.pincode'] = 'Pincode should be 6 digits';
    }
    if (current === 'Tickets') {
      if (!form.ticketTiers?.length) e.ticketTiers = 'Add at least one tier';
      form.ticketTiers?.forEach((t, i) => {
        if (!t.name?.trim()) e[`ticketTiers.${i}.name`] = 'Tier name required';
        if (t.price === '' || t.price === undefined || isNaN(Number(t.price)))
          e[`ticketTiers.${i}.price`] = 'Price required (0 for free)';
        else if (Number(t.price) < 0)
          e[`ticketTiers.${i}.price`] = 'Price must be 0 or more';
        if (!t.totalQuantity || Number(t.totalQuantity) < 1)
          e[`ticketTiers.${i}.totalQuantity`] = 'Total quantity must be ≥ 1';
      });
    }
    if (current === 'Ride Details' && form.category === 'bike-ride') {
      const r = form.rideDetails || {};
      if (!r.meetupTime?.trim()) e['ride.meetupTime'] = 'Meetup time required';
      if (r.distanceKm && (isNaN(+r.distanceKm) || +r.distanceKm <= 0))
        e['ride.distanceKm'] = 'Distance must be a positive number';
      if (r.durationDays && (isNaN(+r.durationDays) || +r.durationDays <= 0))
        e['ride.durationDays'] = 'Duration must be a positive number';
      if (!r.difficulty) e['ride.difficulty'] = 'Pick a difficulty';
    }
    setErrors(e);
    if (Object.keys(e).length) {
      toast(Object.values(e)[0], 'error');
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) {
      setErrors({});
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  };

  // Handle promotion payment after event is saved
  const handlePromotionPayment = async (eventId, promotionTypes, eventTitle) => {
    try {
      // Create order
      const orderRes = await fetch(`/api/events/${eventId}/promote/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ types: promotionTypes }),
      });
      const order = await orderRes.json();
      
      if (!order.ok) {
        throw new Error(order.error || 'Could not create promotion order');
      }

      // Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error('Payment gateway failed to load. Check your internet connection.');
      }

      // Open Razorpay modal
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'TryLinqr',
          description: `Promotion for ${eventTitle}`,
          order_id: order.orderId,
          theme: { color: '#944268' },
          handler: async (response) => {
            try {
              // Verify payment
              const verifyRes = await fetch(`/api/events/${eventId}/promote/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  types: promotionTypes,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const v = await verifyRes.json();
              
              if (!v.ok) {
                throw new Error(v.error || 'Payment verification failed');
              }
              
              toast('Promotions activated successfully!', 'success');
              setSelectedPromotions([]);
              router.push('/dashboard/events');
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: {
            ondismiss: () => {
              toast('Event saved, but promotion payment was cancelled. You can add promotions later from the edit page.', 'info');
              router.push('/dashboard/events');
              resolve();
            }
          },
        });
        rzp.open();
      });
    } catch (e) {
      console.error('Promotion payment error:', e);
      toast(e.message || 'Promotion payment failed. Event is saved. You can add promotions later.', 'error');
      router.push('/dashboard/events');
    }
  };

  const submit = async (publish) => {
    if (!validateStep()) return;
    setBusy(true);
    const cleaned = { ...form };
    // Coerce ticket-tier numeric fields back to Numbers on submit.
    cleaned.ticketTiers = (cleaned.ticketTiers || []).map((t) => ({
      ...t,
      price: Number(t.price) || 0,
      totalQuantity: Number(t.totalQuantity) || 1,
    }));
    if (cleaned.category !== 'bike-ride') {
      cleaned.rideDetails = null;
    } else {
      // coerce numbers
      const r = cleaned.rideDetails;
      cleaned.rideDetails = {
        ...r,
        distanceKm: r.distanceKm ? Number(r.distanceKm) : undefined,
        durationDays: r.durationDays ? Number(r.durationDays) : undefined,
      };
    }
    const payload = { ...cleaned, publish };
    
    try {
      const res = await fetch(
        savedEventId ? `/api/events/${savedEventId}` : '/api/events',
        {
          method: savedEventId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            savedEventId
              ? { ...cleaned, status: publish ? 'published' : 'draft' }
              : payload
          ),
        }
      );
      const data = await res.json();
      
      if (!data.ok) {
        toast(data.error || 'Failed to save event', 'error');
        return;
      }

      // Store the event ID if this was a new event creation
      const createdEventId = data.event?._id || savedEventId;
      if (!savedEventId && createdEventId) {
        setSavedEventId(createdEventId);
      }

      // If promotions were selected, trigger payment flow
      if (selectedPromotions.length > 0 && createdEventId) {
        toast('Event saved! Opening payment for promotions...', 'success');
        // Trigger promotion payment
        await handlePromotionPayment(createdEventId, selectedPromotions, form.title || 'your event');
        return;
      }

      toast(
        publish
          ? 'Event published — it’s now live!'
          : savedEventId
          ? 'Event updated'
          : 'Draft saved',
        'success'
      );
      router.push('/dashboard/events');
    } catch (e) {
      console.error('Submit error:', e);
      toast('Failed to save event. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page header */}
      <div className="mb-6">
        <p className="section-eyebrow">
          {eventId ? 'Edit event' : 'Create event'}
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-obsidian sm:text-3xl">
          {eventId
            ? form.title || 'Edit your event'
            : 'Bring your event to TryLinqr'}
        </h1>
        <p className="mt-1 text-sm text-obsidian/65">
          Step {step + 1} of {STEPS.length} · {current}
        </p>
      </div>

      {/* Stepper — numbered pills, sticky on scroll on mobile */}
      <div className="sticky top-[68px] z-10 -mx-1 mb-6 rounded-2xl border border-ink-line bg-white/95 p-2.5 backdrop-blur-sm">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => i <= step && setStep(i)}
                className={`group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-brand-700 text-white shadow-glow-soft'
                    : done
                    ? 'bg-brand-700/[0.08] text-brand-700 hover:bg-brand-700/[0.14]'
                    : 'text-obsidian/55'
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : done
                      ? 'bg-brand-700 text-white'
                      : 'bg-pearl text-obsidian/55'
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-ink-line bg-white p-6 shadow-card sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {current === 'Basics' && (
              <>
                <h2 className="text-lg font-bold">Basic information</h2>
                <div>
                  <label className="label flex items-center justify-between gap-2">
                    <span>Event title</span>
                    <span className="text-[11px] font-normal text-ink-muted">
                      {form.title.length}/120
                    </span>
                  </label>
                  <input
                    className={`input ${errors.title ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                    aria-invalid={!!errors.title}
                    maxLength={120}
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                  />
                  <FieldError name="title" errors={errors} />
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
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Sub-category</label>
                    <div className="relative">
                      <input
                        className="input pr-9"
                        list={`sub-${form.category}`}
                        placeholder="Pick one or type your own"
                        value={form.subCategory}
                        onChange={(e) => set('subCategory', e.target.value)}
                      />
                      {form.subCategory && (
                        <button
                          type="button"
                          aria-label="Clear sub-category"
                          onClick={() => set('subCategory', '')}
                          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-muted hover:bg-pearl hover:text-brand-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <datalist id={`sub-${form.category}`}>
                      {(SUB_CATEGORIES[form.category] || []).map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      Tap × to clear and pick another.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="label flex items-center justify-between gap-2">
                    <span>Description</span>
                    <span className="text-[11px] font-normal text-ink-muted">
                      {form.description.length}/2000
                    </span>
                  </label>
                  <textarea
                    rows={5}
                    className={`input resize-none ${errors.description ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                    aria-invalid={!!errors.description}
                    maxLength={2000}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                  <FieldError name="description" errors={errors} />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label className="label !mb-0">Tags</label>
                    <button
                      type="button"
                      onClick={() => {
                        const auto = suggestTags({
                          title: form.title,
                          description: form.description,
                          category: form.category,
                          city: form.venue?.city,
                        });
                        const merged = Array.from(
                          new Set([...(form.tags || []), ...auto])
                        ).slice(0, 10);
                        set('tags', merged);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md bg-brand-700/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 hover:bg-brand-700/[0.14]"
                    >
                      <Sparkles className="h-3 w-3" /> Suggest tags
                    </button>
                  </div>
                  <input
                    className="input"
                    placeholder="comma-separated · use Suggest tags to auto-fill"
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
                  {form.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {form.tags.map((t) => (
                        <span
                          key={t}
                          className="chip border border-ink-line bg-pearl text-obsidian/70"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {current === 'Date & Venue' && (
              <>
                <h2 className="text-lg font-bold">Date & venue</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Start date</label>
                    <input
                      type="date"
                      className={`input ${errors.startDate ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                      aria-invalid={!!errors.startDate}
                      min={new Date().toISOString().slice(0, 10)}
                      value={form.startDate}
                      onChange={(e) => set('startDate', e.target.value)}
                    />
                    <FieldError name="startDate" errors={errors} />
                  </div>
                  <div>
                    <label className="label">End date</label>
                    <input
                      type="date"
                      className={`input ${errors.endDate ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                      aria-invalid={!!errors.endDate}
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(e) => set('endDate', e.target.value)}
                    />
                    <FieldError name="endDate" errors={errors} />
                  </div>
                  <div>
                    <label className="label">Start time (AM/PM)</label>
                    <TimePicker12h
                      value={form.startTime}
                      onChange={(v) => set('startTime', v)}
                      ariaInvalid={!!errors.startTime}
                    />
                    <FieldError name="startTime" errors={errors} />
                  </div>
                  <div>
                    <label className="label">End time (AM/PM)</label>
                    <TimePicker12h
                      value={form.endTime}
                      onChange={(v) => set('endTime', v)}
                    />
                  </div>
                </div>
                <LocationPicker
                  label="Pick venue location"
                  placeholder="Search a venue, landmark or address…"
                  value={form.venue.address || ''}
                  onSelect={(loc) =>
                    setForm((f) => ({
                      ...f,
                      venue: {
                        ...f.venue,
                        address: loc.displayName,
                        city: loc.city || f.venue.city,
                        state: loc.state || f.venue.state,
                        country: loc.country || f.venue.country,
                        pincode: loc.pincode || f.venue.pincode,
                        lat: loc.lat,
                        lng: loc.lng,
                      },
                    }))
                  }
                />
                <p className="-mt-2 text-xs text-ink-muted">
                  Use the search above to auto-fill city, state, country and
                  coordinates. You can still edit any field below.
                </p>

                <div>
                  <label className="label">
                    Venue name{' '}
                    <span className="text-xs font-normal text-ink-muted">
                      ({form.category === 'bike-ride'
                        ? 'ride start point — where riders meet'
                        : 'name of the venue or meet-up place'})
                    </span>
                  </label>
                  <input
                    className={`input ${errors['venue.name'] ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                    aria-invalid={!!errors['venue.name']}
                    placeholder={
                      form.category === 'bike-ride'
                        ? 'e.g. India Gate (start point), Ridge Manali (camp)'
                        : 'e.g. Super Chai, Bandstand, Lakshya Auditorium'
                    }
                    value={form.venue.name}
                    onChange={(e) => setVenue('name', e.target.value)}
                  />
                  <FieldError name="venue.name" errors={errors} />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">City</label>
                    <input
                      className={`input ${errors['venue.city'] ? 'border-brand-700 focus:ring-brand-700/20' : ''}`}
                      aria-invalid={!!errors['venue.city']}
                      list="cities"
                      value={form.venue.city}
                      onChange={(e) => setVenue('city', e.target.value)}
                    />
                    <datalist id="cities">
                      {CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <FieldError name="venue.city" errors={errors} />
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
                    <label className="label">Country</label>
                    <input
                      className="input"
                      value={form.venue.country || ''}
                      onChange={(e) => setVenue('country', e.target.value)}
                    />
                  </div>
                </div>

                {(form.venue.lat || form.venue.pincode) && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    {form.venue.pincode && (
                      <span className="chip border border-ink-line bg-pearl text-obsidian/70">
                        PIN · {form.venue.pincode}
                      </span>
                    )}
                    {form.venue.lat && (
                      <span className="chip border border-ink-line bg-pearl text-obsidian/70">
                        {Number(form.venue.lat).toFixed(4)},{' '}
                        {Number(form.venue.lng).toFixed(4)}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {current === 'Ride Details' && (
              <>
                <div className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-brand-700" />
                  <h2 className="text-lg font-bold">Ride details</h2>
                </div>
                <p className="text-sm text-obsidian/65">
                  These show up on the event page so riders know exactly what
                  to bring and what to expect.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Meetup time (AM/PM)</label>
                    <TimePicker12h
                      value={form.rideDetails.meetupTime}
                      onChange={(v) => setRide('meetupTime', v)}
                    />
                  </div>
                  <div>
                    <label className="label">Ride starts — sharp (AM/PM)</label>
                    <TimePicker12h
                      value={form.rideDetails.rideStartTime}
                      onChange={(v) => setRide('rideStartTime', v)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Ride till (destination)</label>
                  <input
                    className="input"
                    placeholder="e.g. Panchgaon, Gurugram, HR"
                    value={form.rideDetails.rideTill}
                    onChange={(e) => setRide('rideTill', e.target.value)}
                  />
                </div>

                {/* Map-picker for the destination — same component as the
                    venue picker on the Date & Venue step. */}
                <LocationPicker
                  label="Destination location (map / autocomplete)"
                  placeholder="Search the destination town, landmark, hotel…"
                  value={form.rideDetails.destination?.address || ''}
                  onSelect={(loc) =>
                    setRide('destination', {
                      name: loc.name || form.rideDetails.destination?.name || '',
                      address: loc.displayName,
                      city: loc.city || '',
                      state: loc.state || '',
                      country: loc.country || '',
                      pincode: loc.pincode || '',
                      lat: loc.lat,
                      lng: loc.lng,
                    })
                  }
                />
                {form.rideDetails.destination?.city && (
                  <p className="-mt-2 text-xs text-ink-muted">
                    Pinned: {form.rideDetails.destination.city}
                    {form.rideDetails.destination.state
                      ? `, ${form.rideDetails.destination.state}`
                      : ''}
                    {form.rideDetails.destination.lat
                      ? ` · ${Number(form.rideDetails.destination.lat).toFixed(4)}, ${Number(form.rideDetails.destination.lng).toFixed(4)}`
                      : ''}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">
                      Distance (km){' '}
                      <span className="text-[10px] font-normal text-ink-muted">
                        auto-filled from map · editable
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      placeholder="Pick a destination to auto-fill"
                      value={form.rideDetails.distanceKm}
                      onChange={(e) => {
                        setRide('distanceKm', e.target.value);
                        setTouched((t) => ({ ...t, distanceKm: true }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">
                      Duration (days){' '}
                      <span className="text-[10px] font-normal text-ink-muted">
                        auto-estimated · editable
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input"
                      placeholder="1 for day rides"
                      value={form.rideDetails.durationDays}
                      onChange={(e) => {
                        setRide('durationDays', e.target.value);
                        setTouched((t) => ({ ...t, durationDays: true }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Difficulty</label>
                    <select
                      className="input"
                      value={form.rideDetails.difficulty}
                      onChange={(e) => setRide('difficulty', e.target.value)}
                    >
                      <option value="">— Pick one —</option>
                      {RIDE_DIFFICULTY.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-ink-line bg-pearl p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-obsidian">
                    <ShieldCheck className="h-4 w-4 text-brand-700" /> Mandatory
                    documents
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RIDE_DOCUMENTS.map((doc) => {
                      const active =
                        form.rideDetails.mandatoryDocuments.includes(doc);
                      return (
                        <button
                          type="button"
                          key={doc}
                          onClick={() => toggleInList('mandatoryDocuments', doc)}
                          className={`chip border ${
                            active
                              ? 'border-brand-700 bg-brand-700 text-white'
                              : 'border-ink-line bg-white text-obsidian/75'
                          }`}
                        >
                          {doc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-ink-line bg-pearl p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-obsidian">
                    <HardHat className="h-4 w-4 text-brand-700" /> Mandatory gear
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RIDE_GEARS.map((g) => {
                      const active =
                        form.rideDetails.mandatoryGears.includes(g);
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => toggleInList('mandatoryGears', g)}
                          className={`chip border ${
                            active
                              ? 'border-brand-700 bg-brand-700 text-white'
                              : 'border-ink-line bg-white text-obsidian/75'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-3 inline-flex items-center gap-2 text-sm text-obsidian/75">
                    <input
                      type="checkbox"
                      checked={form.rideDetails.pillionAllowed}
                      onChange={(e) =>
                        setRide('pillionAllowed', e.target.checked)
                      }
                    />
                    Pillion rider allowed
                  </label>
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-brand-700" /> Fuel policy
                  </label>
                  <input
                    className="input"
                    placeholder="e.g. Fuelled up — no fuel stops in-between"
                    value={form.rideDetails.fuelPolicy}
                    onChange={(e) => setRide('fuelPolicy', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-700" /> Inclusions
                    <span className="text-xs font-normal text-ink-muted">
                      (one per line — &amp;, commas, quotes are all fine)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    className="input resize-none font-sans"
                    placeholder={`2 Nights Stay\nBreakfast & Dinner\nGroup Ride, with marshals\nFuel up at start`}
                    value={(form.rideDetails.inclusions || []).join('\n')}
                    onChange={(e) =>
                      setRide(
                        'inclusions',
                        e.target.value
                          .split(/\r?\n/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-brand-700" /> Ride
                    notes
                  </label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="e.g. The ride will leave at ride-off time, leaving behind anyone who isn't there. Live location will be shared on the main group for catching up later."
                    value={form.rideDetails.rideNotes}
                    onChange={(e) => setRide('rideNotes', e.target.value)}
                  />
                </div>
              </>
            )}

            {current === 'Media' && (
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

            {current === 'Tickets' && (
              <>
                <h2 className="text-lg font-bold">Ticket tiers</h2>
                <TicketTierBuilder
                  tiers={form.ticketTiers}
                  setTiers={(t) => set('ticketTiers', t)}
                />
              </>
            )}

            {current === 'Policies' && (
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
                {/* Auto-embed opt-in — surfaces this event on the organizer's
                    own website via the install-once widget script. */}
                <button
                  type="button"
                  onClick={() => set('showOnOrgSite', !form.showOnOrgSite)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    form.showOnOrgSite
                      ? 'border-brand-700 bg-brand-700/5'
                      : 'border-ink-line bg-white hover:border-brand-700/40'
                  }`}
                >
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      Show this event on my website
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      Auto-displays on your own site through the TryLinqr embed
                      widget. Get the one-time install code from your events
                      list.
                    </span>
                  </span>
                  <span
                    className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      form.showOnOrgSite ? 'bg-brand-700' : 'bg-ink-line'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        form.showOnOrgSite ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>

                {/* Show PromotionPicker for editing existing events */}
                {savedEventId && (
                  <PromotionPicker
                    eventId={savedEventId}
                    eventTitle={form.title || 'this event'}
                    alreadyActive={[
                      initial?.isFeatured && 'hero',
                      initial?.inFeaturedList && 'list',
                      initial?.inSpotlight && 'spotlight',
                      initial?.inTrending && 'trending',
                    ].filter(Boolean)}
                  />
                )}
                {/* Show PromotionSelector for new event creation */}
                {!savedEventId && (
                  <PromotionSelector
                    selected={selectedPromotions}
                    onChange={setSelectedPromotions}
                  />
                )}
                <p className="rounded-xl bg-white/5 p-3 text-sm text-ink-muted">
                  Submit will publish your event immediately if your organizer
                  account is verified. Saving as draft keeps it private.
                  {!savedEventId && selectedPromotions.length > 0 && (
                    <> After submitting, you'll be directed to payment for the selected promotions.</>
                  )}
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
                {busy ? 'Saving…' : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
