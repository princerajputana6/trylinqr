'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Landmark,
  ShieldCheck,
  Save,
  CheckCircle2,
  HandCoins,
  Smartphone,
  Sparkles,
  FileText,
  ScrollText,
  Clock,
} from 'lucide-react';
import { useToast } from '@/components/shared/Toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import DocumentUploader from '@/components/admin/DocumentUploader';
import { formatDateTime } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STATUS = {
  unverified: {
    label: 'Not verified yet',
    tone: 'bg-pearl text-obsidian/70 border-ink-line',
    icon: Clock,
  },
  pending: {
    label: 'Verification pending',
    tone: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Clock,
  },
  verified: {
    label: 'Verified',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Verification rejected',
    tone: 'bg-brand-700/[0.08] text-brand-700 border-brand-700/20',
    icon: ShieldCheck,
  },
};

export default function PayoutsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [status, setStatus] = useState('unverified');
  const [form, setForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    branch: '',
    panNumber: '',
    upiId: '',
    cancelledCheque: null,
    accountStatement: null,
  });

  useEffect(() => {
    fetch('/api/users/me/bank')
      .then((r) => r.json())
      .then((d) => {
        const b = d.bankAccount || {};
        setForm((f) => ({
          ...f,
          accountHolderName: b.accountHolderName || '',
          accountNumber: b.accountNumber || '',
          ifsc: b.ifsc || '',
          bankName: b.bankName || '',
          branch: b.branch || '',
          panNumber: b.panNumber || '',
          upiId: b.upiId || '',
          cancelledCheque: b.cancelledChequeUrl
            ? {
                url: b.cancelledChequeUrl,
                originalName: b.cancelledChequeName,
                resourceType: 'image',
              }
            : null,
          accountStatement: b.accountStatementUrl
            ? {
                url: b.accountStatementUrl,
                originalName: b.accountStatementName,
                resourceType: 'raw',
              }
            : null,
        }));
        if (b.updatedAt) setSavedAt(b.updatedAt);
        setStatus(b.verificationStatus || 'unverified');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setFile = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/users/me/bank', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setBusy(false);
    if (!d.ok) return toast(d.error, 'error');
    toast(d.message, 'success');
    setSavedAt(new Date().toISOString());
    if (d.bankAccount?.verificationStatus)
      setStatus(d.bankAccount.verificationStatus);
  };

  if (loading) return <LoadingSpinner full />;

  const accountMask = form.accountNumber
    ? `••••${form.accountNumber.slice(-4)}`
    : null;
  const StatusIcon = (STATUS[status] || STATUS.unverified).icon;

  return (
    <div className="max-w-4xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="space-y-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="section-eyebrow">Payouts</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
              Bank account & payout setup
            </h1>
            <p className="mt-1 text-sm text-obsidian/65">
              Where TryLinqr sends your event revenue. We use these details
              with Razorpay to settle payouts.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              (STATUS[status] || STATUS.unverified).tone
            }`}
          >
            <StatusIcon className="h-3 w-3" />
            {(STATUS[status] || STATUS.unverified).label}
          </span>
        </motion.div>

        {/* trust strip */}
        <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
          <Trust
            icon={ShieldCheck}
            title="Bank-grade secure"
            body="Details are encrypted in transit and stored only with verified payout partners."
          />
          <Trust
            icon={HandCoins}
            title="Fast settlements"
            body="Payouts arrive within 1–3 business days of event completion."
          />
          <Trust
            icon={Sparkles}
            title="UPI or bank — your pick"
            body="Use either a savings/current account or a UPI ID. Both work."
          />
        </motion.div>

        {savedAt && (
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <div className="flex items-center gap-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Payout details saved.
              {accountMask && (
                <span className="ml-1 font-semibold">{accountMask}</span>
              )}
              {form.ifsc && (
                <span className="ml-1 text-emerald-700">· {form.ifsc}</span>
              )}
            </div>
            <span className="text-xs text-emerald-700/70">
              {formatDateTime(savedAt)}
            </span>
          </motion.div>
        )}

        <motion.form
          variants={fadeUp}
          onSubmit={submit}
          className="space-y-6"
        >
          {/* bank section */}
          <div className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-obsidian">
              <Landmark className="h-4 w-4 text-brand-700" /> Bank account
            </h2>
            <p className="mt-1 text-sm text-obsidian/65">
              Add an Indian savings or current account.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Account holder name</label>
                <input
                  className="input"
                  placeholder="As per bank records"
                  value={form.accountHolderName}
                  onChange={set('accountHolderName')}
                />
              </div>
              <div>
                <label className="label">Account number</label>
                <input
                  className="input"
                  placeholder="8–18 digits"
                  inputMode="numeric"
                  value={form.accountNumber}
                  onChange={set('accountNumber')}
                />
              </div>
              <div>
                <label className="label">IFSC code</label>
                <input
                  className="input uppercase"
                  placeholder="e.g. HDFC0001234"
                  value={form.ifsc}
                  onChange={set('ifsc')}
                />
              </div>
              <div>
                <label className="label">Bank name</label>
                <input
                  className="input"
                  placeholder="e.g. HDFC Bank"
                  value={form.bankName}
                  onChange={set('bankName')}
                />
              </div>
              <div>
                <label className="label">Branch (optional)</label>
                <input
                  className="input"
                  placeholder="e.g. Connaught Place"
                  value={form.branch}
                  onChange={set('branch')}
                />
              </div>
              <div>
                <label className="label">PAN number (recommended)</label>
                <input
                  className="input uppercase"
                  placeholder="e.g. ABCDE1234F"
                  value={form.panNumber}
                  onChange={set('panNumber')}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-ink-line pt-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-obsidian">
                <Smartphone className="h-4 w-4 text-brand-700" /> UPI (optional
                alt)
              </h2>
              <p className="mt-1 text-sm text-obsidian/65">
                Small payouts can route via UPI when available.
              </p>
              <div className="mt-4">
                <label className="label">UPI ID</label>
                <input
                  className="input"
                  placeholder="e.g. yourname@upi"
                  value={form.upiId}
                  onChange={set('upiId')}
                />
              </div>
            </div>
          </div>

          {/* verification proofs */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-700" />
              <h2 className="font-display text-lg font-bold text-obsidian">
                Verification documents
              </h2>
              <span className="text-xs text-ink-muted">
                · upload one or both — speeds up payout activation
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DocumentUploader
                label="Cancelled cheque"
                description="Clear photo of a cancelled cheque from the account above."
                icon={FileText}
                value={form.cancelledCheque}
                onChange={setFile('cancelledCheque')}
              />
              <DocumentUploader
                label="Account statement"
                description="Latest 1–3 month bank statement (PDF preferred)."
                icon={ScrollText}
                value={form.accountStatement}
                onChange={setFile('accountStatement')}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-muted">
              Once you submit a proof we mark your account as
              <span className="font-semibold text-obsidian"> Pending </span>
              and the team verifies it before your first payout.
            </p>
            <button disabled={busy} className="btn-primary">
              <Save className="h-4 w-4" />
              {busy ? 'Saving…' : 'Save payout details'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

function Trust({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-sm font-bold text-obsidian">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-obsidian/65">{body}</p>
    </div>
  );
}
