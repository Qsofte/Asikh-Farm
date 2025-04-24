const { test, expect } = require("@playwright/test");

test("has title", async ({ page }) => {
  await page.goto("http://test.asikh-farms.com/Connect");

  await expect(page).toHaveTitle("Asikh Farms");
});

test("get started link", async ({ page }) => {
  await page.goto("http://test.asikh-farms.com/Connect");
});
