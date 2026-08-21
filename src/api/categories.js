import { ENDPOINTS } from '../constants/config';
import { apiFetch } from '../utils/apiClient';

export async function getCategories() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let res;
  try {
    res = await apiFetch(ENDPOINTS.CATEGORIES, {
      signal: controller.signal,
    });
  } catch (err) {
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`Categories fetch failed: ${res.status}`);
  }

  const json = await res.json();
  return json.response_data ?? [];
}
