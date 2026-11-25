import { io } from 'socket.io-client';

const DEFAULT_DEV_SERVER = 'http://localhost:3001';

/**
 * Normalize base server URL by stripping trailing slashes and any accidental `/coup` suffix.
 */
export function normalizeServerUrl(rawUrl) {
  const value = String(rawUrl || DEFAULT_DEV_SERVER).trim();
  if (!value) return DEFAULT_DEV_SERVER;
  const withoutTrailingSlash = value.replace(/\/+$/, '');
  const withoutNamespace = withoutTrailingSlash.replace(/\/coup$/i, '').replace(/\/+$/, '');
  return withoutNamespace || DEFAULT_DEV_SERVER;
}

export const COUP_SERVER_BASE_URL = normalizeServerUrl(import.meta.env.VITE_COUP_SERVER_URL);
export const COUP_NAMESPACE_URL = `${COUP_SERVER_BASE_URL}/coup`;

export const coupSocket = io(COUP_NAMESPACE_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 800,
  reconnectionDelayMax: 4000,
});

/**
 * Emit a Coup socket event and await its CoupAckResponse<{...}> callback safely.
 * Omits the payload argument completely when `payload === undefined` so no-arg events
 * pass `ack` directly as the first parameter per the server contract.
 */
export function emitCoupEvent(event, payload, timeoutMs = 10000) {
  return new Promise((resolve) => {
    if (!coupSocket.connected) {
      resolve({
        ok: false,
        error: {
          code: 'DISCONNECTED',
          message: 'لا يوجد اتصال بالخادم حالياً، يرجى الانتظار...',
        },
      });
      return;
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({
        ok: false,
        error: {
          code: 'TIMEOUT',
          message: 'انتهت مهلة الاستجابة من الخادم، حاول مجدداً.',
        },
      });
    }, timeoutMs);

    const handleAck = (res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (res && typeof res === 'object' && 'ok' in res) {
        resolve(res);
      } else {
        resolve({
          ok: false,
          error: { code: 'INTERNAL_ERROR', message: 'استجابة غير متوقعة من الخادم.' },
        });
      }
    };

    if (payload === undefined) {
      coupSocket.emit(event, handleAck);
    } else {
      coupSocket.emit(event, payload, handleAck);
    }
  });
}
