'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  RotateCcw,
  Lock,
  Shield,
  User as UserIcon,
  Store,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/shared/Toast';
import { formatDateTime } from '@/lib/utils';
import StatusPill from './StatusPill';

function bubbleClass(role) {
  if (role === 'customer')
    return 'border border-ink-line bg-white text-obsidian self-start';
  if (role === 'admin')
    return 'border border-sand-200 bg-sand-50 text-obsidian self-end';
  if (role === 'superadmin')
    return 'border border-brand-700/20 bg-brand-700/[0.06] text-obsidian self-end';
  // system
  return 'border border-dashed border-ink-line bg-pearl text-obsidian/70 self-center text-center max-w-md italic';
}

function RoleIcon({ role }) {
  if (role === 'customer') return <UserIcon className="h-3.5 w-3.5" />;
  if (role === 'admin') return <Store className="h-3.5 w-3.5" />;
  if (role === 'superadmin') return <Shield className="h-3.5 w-3.5" />;
  return <AlertCircle className="h-3.5 w-3.5" />;
}

function roleLabel(role, name) {
  if (role === 'customer') return name;
  if (role === 'admin') return `${name} · organizer`;
  if (role === 'superadmin') return `${name} · TryLinqr team`;
  return 'System';
}

export default function TicketThread({ ticket, viewerRole, basePath }) {
  const router = useRouter();
  const { toast } = useToast();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const canReply = ticket.status !== 'closed';
  const canResolve =
    viewerRole !== 'customer' &&
    ticket.status !== 'resolved' &&
    ticket.status !== 'closed';
  const canReopen = ticket.status === 'resolved';
  const canClose = viewerRole === 'customer' && ticket.status !== 'closed';

  const reply = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/support/tickets/${ticket._id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    setBody('');
    toast('Reply posted', 'success');
    router.refresh();
  };

  const changeStatus = async (status) => {
    const res = await fetch(`/api/support/tickets/${ticket._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(data.message, 'success');
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* main column */}
      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              {ticket.ticketCode}
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
              {ticket.subject}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusPill status={ticket.status} />
              <span className="chip border border-ink-line bg-white text-obsidian/70">
                {ticket.category}
              </span>
              {ticket.priority !== 'normal' && (
                <span className="chip border border-ink-line bg-white text-obsidian/70">
                  Priority: {ticket.priority}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canResolve && (
              <button
                onClick={() => changeStatus('resolved')}
                className="btn-primary"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark resolved
              </button>
            )}
            {canReopen && (
              <button
                onClick={() => changeStatus('in_progress')}
                className="btn-outline"
              >
                <RotateCcw className="h-4 w-4" /> Reopen
              </button>
            )}
            {canClose && (
              <button
                onClick={() => changeStatus('closed')}
                className="btn-outline"
              >
                <Lock className="h-4 w-4" /> Close
              </button>
            )}
          </div>
        </div>

        <div className="card flex flex-col gap-3 p-5">
          {ticket.messages.map((m, i) => (
            <motion.div
              key={m._id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${bubbleClass(m.role)}`}
            >
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-70">
                <RoleIcon role={m.role} />
                {roleLabel(m.role, m.author?.name || 'User')}
                <span className="ml-auto font-normal opacity-60">
                  {formatDateTime(m.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>

        {canReply ? (
          <form onSubmit={reply} className="card mt-4 space-y-3 p-4">
            <label className="label">Your reply</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Type your message…"
              className="input resize-none"
            />
            <button disabled={busy || !body.trim()} className="btn-primary">
              <Send className="h-4 w-4" />
              {busy ? 'Sending…' : 'Send reply'}
            </button>
          </form>
        ) : (
          <p className="mt-4 rounded-xl border border-ink-line bg-pearl px-4 py-3 text-sm text-ink-muted">
            This ticket is closed. Open a new ticket if you need more help.
          </p>
        )}
      </div>

      {/* side meta */}
      <aside className="space-y-4">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider text-ink-muted">
            Customer
          </p>
          <p className="mt-1 font-semibold text-obsidian">
            {ticket.customer?.name}
          </p>
          <p className="text-sm text-obsidian/70">{ticket.customer?.email}</p>

          <div className="my-4 h-px bg-ink-line" />

          <p className="text-xs uppercase tracking-wider text-ink-muted">
            Assigned to
          </p>
          {ticket.assignedRole === 'admin' && ticket.assignedTo ? (
            <p className="mt-1 font-semibold text-obsidian">
              {ticket.assignedTo.orgName || ticket.assignedTo.name}
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · organizer
              </span>
            </p>
          ) : (
            <p className="mt-1 font-semibold text-obsidian">
              TryLinqr team
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · platform
              </span>
            </p>
          )}
          {ticket.forwardedReason && (
            <p className="mt-2 text-xs text-ink-muted">
              <i>{ticket.forwardedReason}</i>
            </p>
          )}

          {(ticket.relatedEvent || ticket.relatedBooking) && (
            <>
              <div className="my-4 h-px bg-ink-line" />
              <p className="text-xs uppercase tracking-wider text-ink-muted">
                Linked
              </p>
              {ticket.relatedBooking && (
                <p className="mt-1 text-sm">
                  Booking:{' '}
                  <Link
                    href={`/booking/${ticket.relatedBooking._id}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {ticket.relatedBooking.bookingCode}
                  </Link>
                </p>
              )}
              {ticket.relatedEvent && (
                <p className="mt-1 text-sm">
                  Event:{' '}
                  <Link
                    href={`/events/${ticket.relatedEvent.slug}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {ticket.relatedEvent.title}
                  </Link>
                </p>
              )}
            </>
          )}

          <div className="my-4 h-px bg-ink-line" />
          <p className="text-xs uppercase tracking-wider text-ink-muted">
            Opened
          </p>
          <p className="mt-1 text-sm text-obsidian">
            {formatDateTime(ticket.createdAt)}
          </p>
        </div>

        {viewerRole === 'superadmin' && ticket.status !== 'closed' && (
          <ForwardCard ticket={ticket} basePath={basePath} />
        )}
      </aside>
    </div>
  );
}

function ForwardCard({ ticket, basePath }) {
  const router = useRouter();
  const { toast } = useToast();
  const [organizers, setOrganizers] = useState([]);
  const [orgId, setOrgId] = useState('');
  const [reason, setReason] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    if (loaded) return;
    const res = await fetch('/api/superadmin/users?role=admin');
    const d = await res.json();
    setOrganizers(
      (d.users || []).filter((u) => u.isApproved && !u.isBanned)
    );
    setLoaded(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/support/tickets/${ticket._id}/forward`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizerId: orgId, reason }),
    });
    const d = await res.json();
    if (!d.ok) return toast(d.error, 'error');
    toast(d.message, 'success');
    router.refresh();
  };

  const takeBack = async () => {
    const res = await fetch(`/api/support/tickets/${ticket._id}/forward`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ takeBack: true }),
    });
    const d = await res.json();
    if (!d.ok) return toast(d.error, 'error');
    toast(d.message, 'success');
    router.refresh();
  };

  return (
    <form onSubmit={submit} onFocus={load} className="card space-y-3 p-5">
      <p className="text-xs uppercase tracking-wider text-ink-muted">
        Route ticket
      </p>
      <p className="text-sm text-obsidian/70">
        Forward this ticket to a specific organizer if it&apos;s related to
        their event, booking or tickets.
      </p>
      <div>
        <label className="label">Organizer</label>
        <select
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          className="input"
          required
        >
          <option value="">Select an organizer…</option>
          {organizers.map((o) => (
            <option key={o._id} value={o._id}>
              {(o.orgName || o.name) + ' — ' + o.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Note (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Brief context for the organizer…"
          className="input resize-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" disabled={!orgId}>
          Forward ticket
        </button>
        {ticket.assignedRole === 'admin' && (
          <button type="button" onClick={takeBack} className="btn-outline">
            Take back
          </button>
        )}
      </div>
    </form>
  );
}
