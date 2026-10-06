import { apiFetch } from '../utils/apiClient';

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Backend bilan yagona muloqot nuqtasi: JSON yuboradi, `response_data` ni
 * qaytaradi, xatoda `ApiError` (server xabari yoki `errorMessage` + `status`) tashlaydi.
 *
 * @param {string} url
 * @param {object} [options]
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} [options.method]
 * @param {object} [options.body] JSON sifatida yuboriladi
 * @param {boolean} [options.auth=true] false — tokensiz (login/ro'yxatdan o'tish) so'rov;
 *   bunda 401 da refresh urinilmaydi
 * @param {string} [options.errorMessage] server xabar bermaganda ko'rsatiladigan matn
 * @param {number} [options.timeout]
 */
export async function request(
  url,
  { method = 'GET', body, auth = true, errorMessage, timeout = DEFAULT_TIMEOUT_MS } = {},
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const init = {
    method,
    signal: controller.signal,
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  };

  try {
    const res = await (auth ? apiFetch(url, init) : fetch(url, init));
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(
        json?.message || errorMessage || `So'rov muvaffaqiyatsiz: ${res.status}`,
        res.status,
      );
    }
    return json?.response_data;
  } finally {
    clearTimeout(timer);
  }
}
