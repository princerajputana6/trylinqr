'use client';

import { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'trylinqr/bank' }),
  });
  const sig = await sigRes.json();
  if (!sig.ok) throw new Error(sig.error || 'Upload not configured');

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);

  // auto resource type accepts both images and PDFs
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error('Cloudinary upload failed');
  return {
    url: data.secure_url,
    format: data.format || '',
    originalName: file.name,
    resourceType: data.resource_type,
    bytes: data.bytes,
  };
}

/**
 * Uploader for a single document (image or PDF).
 *   value = { url, format, originalName, resourceType }
 *   onChange(nextValue) — pass null to clear
 */
export default function DocumentUploader({
  label = 'Document',
  description,
  accept = 'image/*,application/pdf',
  value,
  onChange,
  icon: HeaderIcon = FileText,
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      onChange(uploaded);
      toast('Uploaded', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const isImage =
    value &&
    (value.resourceType === 'image' ||
      /\.(png|jpe?g|gif|webp|heic)$/i.test(value.url));

  return (
    <div className="rounded-2xl border border-ink-line bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
          <HeaderIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-obsidian">
            {label}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-obsidian/65">{description}</p>
          )}
        </div>
        {value && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            <Check className="h-3 w-3" /> Uploaded
          </span>
        )}
      </div>

      {value ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-ink-line bg-pearl p-3">
          {isImage ? (
            <img
              src={value.url}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-white text-brand-700">
              <FileText className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-obsidian">
              {value.originalName || value.url.split('/').pop()}
            </p>
            <p className="text-xs uppercase tracking-wider text-ink-muted">
              {value.format || value.resourceType || 'file'}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs">
              <a
                href={value.url}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
              >
                View <ExternalLink className="h-3 w-3" />
              </a>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 text-obsidian/65 hover:text-brand-700"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-line bg-pearl px-4 py-6 text-center text-xs text-ink-muted transition-colors hover:border-brand-700 hover:text-brand-700">
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
          {busy ? 'Uploading…' : 'Click to upload — PDF or image, up to 5 MB'}
          <input
            type="file"
            accept={accept}
            hidden
            onChange={handle}
            disabled={busy}
          />
        </label>
      )}
    </div>
  );
}
