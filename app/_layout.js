import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api/queryClient';
import { ThemeProvider } from '../src/context/ThemeContext';
import { clearCachedUser } from '../src/context/UserContext';
import { onSessionExpired } from '../src/utils/apiClient';

export default function RootLayout() {
  const router = useRouter();

  // Refresh token ham yaroqsiz bo'lsa (apiClient tokenlarni tozalagan) —
  // keshni o'chirib, foydalanuvchini bosh sahifaga qaytaramiz.
  useEffect(
    () =>
      onSessionExpired(() => {
        clearCachedUser();
        router.replace('/');
      }),
    [router],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
