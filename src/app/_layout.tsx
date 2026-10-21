import '@/services/firebase/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { configureForE2E } from '@/lib/e2e';
import { firebaseRepository } from '@/services/firebase/repository';
import { RepositoryProvider } from '@/services/repository';

configureForE2E();

export default function RootLayout() {
  // Created once per app launch; useState keeps the same client across re-renders.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider repository={firebaseRepository}>
        <Stack />
      </RepositoryProvider>
    </QueryClientProvider>
  );
}
