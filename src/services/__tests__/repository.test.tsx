import { renderHook } from '@testing-library/react-native';

import { useRepository } from '@/services/repository';
import { createFakeRepository } from '@/test/fakes/repository';
import { renderHookWithProviders } from '@/test/render';

describe('useRepository', () => {
  it('returns the repository the app was given', async () => {
    const fake = createFakeRepository();
    const { result } = await renderHookWithProviders(() => useRepository(), { repository: fake });
    expect(result.current).toBe(fake);
  });

  it('fails clearly when the provider is missing', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined); // React logs the thrown error
    await expect(renderHook(() => useRepository())).rejects.toThrow(
      'useRepository must be used inside <RepositoryProvider>',
    );
  });
});
