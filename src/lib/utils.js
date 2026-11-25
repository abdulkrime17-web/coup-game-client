import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const STORAGE_KEYS = {
  SESSION_ID: 'coup_sessionId',
  ROOM_CODE: 'coup_roomCode',
  PLAYER_NAME: 'coup_playerName',
  MUTED: 'coup_muted',
};

/**
 * Convert Arabic-Indic and Extended Arabic-Indic digits to ASCII digits (0-9).
 */
export function normalizeDigits(value = '') {
  return String(value)
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function normalizeRoomCode(value = '') {
  return normalizeDigits(value).replace(/\D/g, '').slice(0, 4);
}

export function isValidRoomCode(code) {
  return /^\d{4}$/.test(code);
}

/**
 * Match server playerName validation: 2..16 chars after trim, no < > or control/invisible chars.
 */
export function validatePlayerName(rawName) {
  const trimmed = String(rawName || '').trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'يجب أن يكون الاسم حرفين على الأقل' };
  }
  if (trimmed.length > 16) {
    return { valid: false, error: 'يجب ألا يتجاوز الاسم 16 حرفاً' };
  }
  if (/[<>]/.test(trimmed) || /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\uFEFF]/.test(trimmed)) {
    return { valid: false, error: 'الاسم يحتوي على رموز غير مسموح بها' };
  }
  return { valid: true, value: trimmed };
}

export function safeStorageGet(key, fallback = '') {
  try {
    const val = window.localStorage.getItem(key);
    return val ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeStorageSet(key, value) {
  try {
    if (value === null || value === undefined || value === '') {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, String(value));
    }
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `coup_${crypto.randomUUID()}`;
  }
  const rand = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  return `coup_${rand}`;
}

export function getOrCreateSessionId() {
  const existing = safeStorageGet(STORAGE_KEYS.SESSION_ID, '').trim();
  if (existing.length >= 8 && existing.length <= 128) {
    return existing;
  }
  const fresh = generateSessionId();
  safeStorageSet(STORAGE_KEYS.SESSION_ID, fresh);
  return fresh;
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function formatTimeArabic(timestamp) {
  if (!timestamp) return '';
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}
