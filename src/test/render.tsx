import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

import { RepositoryProvider, type Repository } from '@/services/repository';

import { createFakeRepository } from './fakes/repository';

interface Options {
  repository?: Repository;
}

function makeWrapper({ repository = createFakeRepository() }: Options) {
  // A fresh client per test, with no retries, so failures show up immediately.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <RepositoryProvider repository={repository}>{children}</RepositoryProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  return render(ui, { wrapper: makeWrapper(options) });
}

export function renderHookWithProviders<Result>(hook: () => Result, options: Options = {}) {
  return renderHook(hook, { wrapper: makeWrapper(options) });
}
