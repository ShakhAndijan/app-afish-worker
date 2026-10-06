import { ENDPOINTS } from '../constants/config';
import {
  getToken,
  getRefreshToken,
  saveToken,
  saveRefreshToken,
  clearTokens,
} from './token';

const REFRESH_TIMEOUT_MS = 10000;

const sessionExpiredListeners = new Set();

/**
 * Sessiya tiklab bo'lmaydigan darajada tugaganda (refresh token ham yaroqsiz)
 * chaqiriladi. Tokenlar shu vaqtga kelib allaqachon tozalangan bo'ladi.
 * @returns {() => void} obunani bekor qilish funksiyasi
 */
export function onSessionExpired(listener) {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

async function expireSession() {
  await clearTokens();
  sessionExpiredListeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });
}

async function requestNewTokens(refreshToken) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);
  try {
    return await fetch(ENDPOINTS.AUTH_REFRESH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Access tokenni refresh token bilan yangilaydi. Yangi access token yoki
 * (yangilab bo'lmasa) null qaytaradi. Faqat server refresh tokenni aniq
 * rad etganda (4xx) sessiya tugatiladi; tarmoq/5xx xatosida foydalanuvchi
 * tizimda qoladi va keyingi so'rovda qayta uriniladi.
 */
async function refreshTokens() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await expireSession();
    return null;
  }

  let res;
  try {
    res = await requestNewTokens(refreshToken);
  } catch {
    return null;
  }

  // Kutish vaqtida foydalanuvchi chiqib ketgan yoki qayta kirgan bo'lsa,
  // eskirgan natijani yozmaymiz.
  if ((await getRefreshToken()) !== refreshToken) return getToken();

  if (res.ok) {
    const data = (await res.json().catch(() => null))?.response_data;
    if (!data?.access_token) return null;
    await saveToken(data.access_token);
    // Backend refresh tokenni aylantirsa (rotation), yangisini saqlaymiz.
    if (data.refresh_token) await saveRefreshToken(data.refresh_token);
    return data.access_token;
  }

  if (res.status >= 400 && res.status < 500) await expireSession();
  return null;
}

// Bir vaqtda kelgan bir nechta 401 uchun bitta refresh so'rovi (single-flight).
// Rotation bo'lganda parallel refresh'lar bir-birining tokenini bekor qilib yuborardi.
let refreshInFlight = null;
function refreshTokensOnce() {
  if (!refreshInFlight) {
    refreshInFlight = refreshTokens().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function send(url, options, token) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/**
 * fetch wrapper: saqlangan tokenni Authorization header sifatida qo'shadi.
 * Server 401 qaytarsa, refresh token bilan access tokenni yangilab, so'rovni
 * bir marta qayta yuboradi. Refresh ham rad etilsa, sessiya tugatiladi va
 * `onSessionExpired` obunachilari xabardor qilinadi.
 */
export async function apiFetch(url, options = {}) {
  const token = await getToken();
  const res = await send(url, options, token);

  if (res.status !== 401 || !token) return res;

  // Boshqa parallel so'rov tokenni allaqachon yangilab qo'ygan bo'lishi mumkin.
  const latest = await getToken();
  const next = latest && latest !== token ? latest : await refreshTokensOnce();
  if (!next) return res;

  return send(url, options, next);
}
