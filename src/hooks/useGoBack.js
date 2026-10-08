import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * "Orqaga" amali: ekran tarixi bo'lsa shunga qaytadi, bo'lmasa (masalan,
 * deep link orqali to'g'ridan-to'g'ri ochilganda) `fallback` yo'nalishga o'tadi.
 */
export function useGoBack(fallback = '/') {
  const router = useRouter();
  return useCallback(
    () => (router.canGoBack() ? router.back() : router.replace(fallback)),
    [router, fallback],
  );
}
