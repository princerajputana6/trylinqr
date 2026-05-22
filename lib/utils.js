import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(text) {
  return `${slugify(text)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(date, opts = {}) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

export function formatDateTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateBookingCode() {
  return 'TLQ-' + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function platformFeePercent() {
  return Number(process.env.PLATFORM_FEE_PERCENT || 5);
}

export function calcPlatformFee(amount) {
  return Math.round((amount * platformFeePercent()) / 100);
}

export function isUpcoming(date) {
  return new Date(date).getTime() >= Date.now();
}

export function timeUntil(date) {
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return 'Started';
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} to go`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} to go`;
  const mins = Math.floor(diff / 60000);
  return `${mins} min to go`;
}
