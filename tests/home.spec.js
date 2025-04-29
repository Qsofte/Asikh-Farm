import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Hero section elements are visible', async ({ page }) => {
    // Heading
    const heroHeading = page.locator('section >> h1');
    await expect(heroHeading).toBeVisible();
    // Explore button
    const exploreBtn = page.getByRole('button', { name: /explore/i });
    await expect(exploreBtn).toBeVisible();
  });

  test('Click Explore navigates to Contact page', async ({ page }) => {
    await page.getByRole('button', { name: /explore/i }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('Product slider is present and has slides', async ({ page }) => {
    const slides = page.locator('.swiper-slide');
    const count = await slides.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Export countries are displayed', async ({ page }) => {
    await expect(page.getByText('England', { exact: true })).toBeVisible();
    await expect(page.getByText('Germany', { exact: true })).toBeVisible();
    await expect(page.getByText('New Zealand', { exact: true })).toBeVisible();
  });
});
