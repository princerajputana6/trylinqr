import { NextResponse } from 'next/server';
import Notification from '@/models/Notification';

export function ok(data = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function fail(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function notify(userId, type, message, link) {
  try {
    await Notification.create({ user: userId, type, message, link });
  } catch (e) {
    console.error('notify failed', e);
  }
}
