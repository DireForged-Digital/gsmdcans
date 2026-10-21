import { describe, expect, it } from 'vitest';

describe('functions entry point', () => {
  it('loads without errors', async () => {
    // Catches broken imports or bad global options before a deploy does.
    await expect(import('../src/index.js')).resolves.toBeDefined();
  });
});
