import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ page }) => {
    // Stub window.location.assign to prevent mailto navigation
    await page.addInitScript(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: '', assign: () => {} }
      });
    });
    // Navigate to Contact page
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('Form fields and submit button are visible', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/surname/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    // Button text is "Send Message" (from en/translation.json contact.form.submit)
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('Submitting contact form shows success message', async ({ page }) => {
    await page.fill('#firstName', 'Jane');
    await page.fill('#surname', 'Doe');
    await page.fill('#email', 'jane.doe@example.com');
    await page.fill('#message', 'Hello there!');
    await page.click('button[type="submit"]');
    // Success message should appear
    await expect(page.locator('.bg-green-100')).toBeVisible();
  });
});
