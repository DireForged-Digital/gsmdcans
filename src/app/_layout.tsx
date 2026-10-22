import '@/services/firebase/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { configureForE2E } from '@/lib/e2e';
import { firebaseRepository } from '@/services/firebase/repository';
import { connectQueryToApp } from '@/services/query/connect';
import { RepositoryProvider } from '@/services/repository';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

configureForE2E();
connectQueryToApp();

export default function RootLayout() {
  // Created once per app launch; useState keeps the same client across re-renders.
  const [queryClient] = useState(() => new QueryClient());
  // Headers and backgrounds follow the system light/dark setting, like the system text colours do.
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider repository={firebaseRepository}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack />
        </ThemeProvider>
      </RepositoryProvider>
    </QueryClientProvider>
  );
}
