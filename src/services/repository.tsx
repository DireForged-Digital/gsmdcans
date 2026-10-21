import { createContext, use, type ReactNode } from 'react';

/**
 * Everything the app can ask the backend for. Each feature adds its methods here,
 * then implements them in the Firebase repository and the test fake.
 */
export interface Repository {
  readonly kind: 'firebase' | 'fake';
}

const RepositoryContext = createContext<Repository | null>(null);

export function RepositoryProvider({
  repository,
  children,
}: {
  repository: Repository;
  children: ReactNode;
}) {
  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>;
}

export function useRepository(): Repository {
  const repository = use(RepositoryContext);
  if (!repository) {
    throw new Error('useRepository must be used inside <RepositoryProvider>');
  }
  return repository;
}
