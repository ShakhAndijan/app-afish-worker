import { QueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Ma'lumot 1 daqiqa "yangi" hisoblanadi: shu vaqt ichida ekranlar
      // o'rtasida o'tganda qayta so'rov yuborilmaydi, keshdan olinadi.
      staleTime: 60 * 1000,
      // 4xx (masalan, 404/403) qayta urinish bilan to'g'rilanmaydi;
      // faqat tarmoq va 5xx xatolarida qayta uriniladi.
      retry: (failureCount, error) => {
        const status = error?.status;
        if (status >= 400 && status < 500) return false;
        return failureCount < MAX_RETRIES;
      },
    },
  },
});
