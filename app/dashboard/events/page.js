'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, SlidersHorizontal, ChevronDown, MapPin,
  CalendarDays, Users, MoreVertical, Pencil, Eye, EyeOff,
  Trash2, ExternalLink, Code2, Star, CheckIcon,
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/admin/StatusBadge';
import EmbedCodeModal from '@/components/admin/EmbedCodeModal';
import { useToast } from '@/components/shared/Toast';
import { formatDate, formatCurrency } from '@/lib/utils';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'revenue', label: 'Revenue' },
];

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70';
const GALLERY_PLACEHOLDER =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=60';

function EventCard({ event: e, onToggle, onDelete, onEmbed, index }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const gallery = e.galleryImages?.filter(Boolean) || [];
  const img1 = gallery[0] || GALLERY_PLACEHOLDER;
  const img2 = gallery[1] || GALLERY_PLACEHOLDER;
  const minPrice = e.ticketTiers?.length
    ? Math.min(...e.ticketTiers.map((t) => Number(t.price) || 0))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card transition-shadow hover:shadow-elevated"
    >
      {/* Image collage */}
      <div className="relative flex h-[220px] gap-1 overflow-hidden">
        <div className="relative flex-1">
          <img
            src={e.bannerImage || PLACEHOLDER}
            alt={e.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Price overlay */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-lg bg-black/60 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
              {minPrice === 0 ? 'Free' : `₹${minPrice.toLocaleString('en-IN')}`}
            </span>
          </div>
          {/* Rating */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-amber-400 px-2 py-0.5 text-xs font-bold text-white">
            <Star className="h-3 w-3 fill-white" />
            {(e.rating || 4.5).toFixed(1)}
          </div>
        </div>
        {/* Right stacked images */}
        <div className="flex w-[90px] shrink-0 flex-col gap-1">
          <img src={img1} alt="" className="h-1/2 w-full object-cover" />
          <img src={img2} alt="" className="h-1/2 w-full object-cover" />
        </div>
        {/* Status badge overlay */}
        <div className="absolute bottom-3 left-3">
          <StatusBadge status={e.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="mb-1 text-[11px] text-ink-muted">
          Posted: {formatDate(e.createdAt || e.startDate)}
        </p>
        <h3 className="line-clamp-1 text-base font-bold text-obsidian">{e.title}</h3>

        <div className="mt-3 flex flex-col gap-1.5 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-700" />
            {e.venue?.city || 'Online'}{e.venue?.state ? `, ${e.venue.state}` : ''}
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand-700" />
            {formatDate(e.startDate)}{e.endDate && e.endDate !== e.startDate ? ` – ${formatDate(e.endDate)}` : ''}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0 text-brand-700" />
            {e.stats?.tickets || 0} Booked · {formatCurrency(e.stats?.revenue || 0)}
          </div>
        </div>

        {/* Actions row */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/dashboard/events/${e._id}/edit`}
            className="btn-outline py-1.5 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-8 w-8 place-items-center rounded-xl border border-ink-line text-ink-muted transition hover:bg-pearl"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-10 right-0 z-20 min-w-[160px] rounded-xl border border-ink-line bg-white py-1 shadow-elevated"
                  >
                    {e.status !== 'cancelled' && (
                      <button
                        onClick={() => { setMenuOpen(false); onToggle(e); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-obsidian hover:bg-pearl"
                      >
                        {e.status === 'published'
                          ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                          : <><Eye className="h-3.5 w-3.5" /> Publish</>}
                      </button>
                    )}
                    {e.status === 'published' && (
                      <Link
                        href={`/events/${e.slug}`}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-obsidian hover:bg-pearl"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View live
                      </Link>
                    )}
                    {e.status === 'published' && (
                      <button
                        onClick={() => { setMenuOpen(false); onEmbed(e); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-obsidian hover:bg-pearl"
                      >
                        <Code2 className="h-3.5 w-3.5" /> Embed code
                      </button>
                    )}
                    {e.status !== 'cancelled' && (
                      <>
                        <div className="mx-3 my-1 h-px bg-ink-line" />
                        <button
                          onClick={() => { setMenuOpen(false); onDelete(e); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-brand-700 hover:bg-brand-700/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [sortOpen, setSortOpen] = useState(false);
  const [embedEvent, setEmbedEvent] = useState(null);

  const load = () => {
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((d) => { setEvents(d.events || []); setLoading(false); });
  };
  useEffect(load, []);

  const counts = useMemo(() => {
    const c = { all: events.length };
    events.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; });
    return c;
  }, [events]);

  const filtered = useMemo(() => {
    let list = tab === 'all' ? events : events.filter((e) => e.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) => e.title?.toLowerCase().includes(q) || e.venue?.city?.toLowerCase().includes(q)
      );
    }
    if (sort === 'oldest') list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'revenue') list = [...list].sort((a, b) => (b.stats?.revenue || 0) - (a.stats?.revenue || 0));
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [events, tab, search, sort]);

  const togglePublish = async (e) => {
    const next = e.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/events/${e._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(next === 'published' ? 'Event published' : 'Event unpublished', 'success');
    load();
  };

  const deleteEvent = async (e) => {
    if (!confirm(`Delete "${e.title}"?\n\nThis cannot be undone.`)) return;
    const res = await fetch(`/api/events/${e._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(data.message || 'Event deleted', 'success');
    if (data.deleted) setEvents((list) => list.filter((x) => x._id !== e._id));
    else setEvents((list) => list.map((x) => x._id === e._id ? { ...x, status: 'cancelled' } : x));
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-obsidian">My Events</h1>
          <p className="text-sm text-ink-muted">{events.length} events total</p>
        </div>
        <Link href="/dashboard/events/create" className="btn-primary">
          <Plus className="h-4 w-4" /> Add event
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-ink-line">
        <div className="no-scrollbar flex gap-0 overflow-x-auto">
          {STATUS_TABS.map((t) => {
            const active = tab === t.value;
            const n = counts[t.value] || 0;
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active ? 'text-obsidian' : 'text-ink-muted hover:text-obsidian'
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-obsidian text-white' : 'bg-pearl text-obsidian/60'}`}>
                  {n}
                </span>
                {active && <motion.div layoutId="ev-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-obsidian" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + sort row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            className="input pl-9"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-ink-line bg-white px-4 py-2.5 text-sm font-medium text-obsidian transition hover:bg-pearl">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-ink-line bg-white px-4 py-2.5 text-sm font-medium text-obsidian transition hover:bg-pearl"
          >
            Sort: {SORT_OPTIONS.find((s) => s.value === sort)?.label}
            <ChevronDown className="h-4 w-4 text-ink-muted" />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-11 z-20 min-w-[150px] rounded-xl border border-ink-line bg-white py-1 shadow-elevated"
                >
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false); }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition hover:bg-pearl ${sort === o.value ? 'font-semibold text-brand-700' : 'text-obsidian'}`}
                    >
                      {o.label}
                      {sort === o.value && <CheckIcon className="ml-auto h-3.5 w-3.5" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-ink-line py-24 text-center">
          <p className="font-semibold text-obsidian">
            {events.length === 0 ? 'No events yet' : `No ${tab === 'all' ? '' : tab} events`}
          </p>
          <p className="mt-1 text-sm text-ink-muted">Create your first event to get started.</p>
          <Link href="/dashboard/events/create" className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Add event
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => (
            <EventCard
              key={e._id}
              event={e}
              index={i}
              onToggle={togglePublish}
              onDelete={deleteEvent}
              onEmbed={setEmbedEvent}
            />
          ))}
        </div>
      )}

      {embedEvent && (
        <EmbedCodeModal event={embedEvent} onClose={() => setEmbedEvent(null)} />
      )}
    </div>
  );
}

