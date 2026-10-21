import type { Repository } from '@/services/repository';

// In-memory stand-in for tests. Tests override only the methods they care about.
export function createFakeRepository(overrides: Partial<Repository> = {}): Repository {
  return { kind: 'fake', ...overrides };
}
