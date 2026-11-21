import { supabase } from './supabase';
import { sanitizeContent } from './defaults';
import type { PhoneContent } from './types';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/admin-api`;

export const SESSION_KEY = 'yasser-admin-session';

async function post(path: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`${FN_URL}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `فشل الطلب (${res.status})`);
  }
  return data;
}

export async function getPublishedState(): Promise<PhoneContent> {
  const { data, error } = await supabase
    .from('phone_state')
    .select('published')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return sanitizeContent(data?.published);
}

export async function login(password: string): Promise<void> {
  await post('login', { password });
  sessionStorage.setItem(SESSION_KEY, password);
}

export function getStoredPassword(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function verifyPassword(password: string): Promise<void> {
  await post('verify', { password });
}

export async function getAdminState(password: string): Promise<{ draft: PhoneContent; published: PhoneContent; publishedAt: string }> {
  const data = await post('state', { password });
  void password;
  return {
    draft: sanitizeContent((data as { draft: unknown }).draft),
    published: sanitizeContent((data as { published: unknown }).published),
    publishedAt: String((data as { publishedAt?: string }).publishedAt || ''),
  };
}

export async function saveDraft(password: string, draft: PhoneContent): Promise<void> {
  await post('savedraft', { password, draft });
}

export async function publish(password: string): Promise<void> {
  await post('publish', { password });
}export async function uploadPhoto(password: string, file: File, albumId: string): Promise<{ url: string; path: string }> {
  const stored = sessionStorage.getItem(SESSION_KEY);
  void password;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('albumId', albumId);
  const res = await fetch(`${FN_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${stored || ''}` },
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `فشل رفع الصورة (${res.status})`);
  }
  return { url: (data as { url: string }).url, path: (data as { path: string }).path };
}

export async function deletePhotoFile(password: string, path: string): Promise<void> {
  await post('deletephoto', { password, path });
}

export async function changePassword(password: string, currentPassword: string, newPassword: string): Promise<void> {
  await post('changepassword', { password, currentPassword, newPassword });
}
