'use client';

import { useState } from 'react';
import { UploadCloud, X, Loader2, Link2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'trylinqr' }),
  });
  const sig = await sigRes.json();
  if (!sig.ok) throw new Error(sig.error || 'Upload not available');

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error('Cloudinary upload failed');
  return data.secure_url;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = 'Image',
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const images = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadToCloudinary(file));
      }
      if (multiple) onChange([...(value || []), ...urls]);
      else onChange(urls[0]);
      toast('Image uploaded', 'success');
    } catch (e) {
      toast(e.message + ' — paste an image URL instead', 'error');
    } finally {
      setBusy(false);
    }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    if (multiple) onChange([...(value || []), urlInput.trim()]);
    else onChange(urlInput.trim());
    setUrlInput('');
  };

  const remove = (url) => {
    if (multiple) onChange((value || []).filter((u) => u !== url));
    else onChange('');
  };

  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-24 w-32 overflow-hidden rounded-xl">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-ink/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {(multiple || !images.length) && (
          <label className="grid h-24 w-32 cursor-pointer place-items-center rounded-xl border border-dashed border-white/15 text-ink-muted hover:border-brand-500 hover:text-brand-400">
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-xs">
                <UploadCloud className="h-5 w-5" />
                Upload
              </div>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              multiple={multiple}
              hidden
              onChange={(e) => handleFiles(Array.from(e.target.files))}
            />
          </label>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="…or paste an image URL"
            className="input pl-9"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-outline">
          Add
        </button>
      </div>
    </div>
  );
}
