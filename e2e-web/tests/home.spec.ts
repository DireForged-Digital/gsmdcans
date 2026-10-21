import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Edit src/app/index.tsx to edit this screen.')).toBeVisible();
});
