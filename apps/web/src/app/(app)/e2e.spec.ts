import { expect, test } from '@playwright/test';

// These strings are derived from the UI; if localization varies by locale,
// we assert on stable UI roles and existence as much as possible.

test.describe('Home Todos Page', () => {
  test('loads and shows header and action', async ({ page, baseURL }) => {
    await page.goto(baseURL ?? '/');

    // Shell header should be present with a title and description
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    // The action button to create a new todo should exist and link to /todos/new
    const newTodoLink = page.locator('a[href="/todos/new"]').first();
    await expect(newTodoLink).toBeVisible();
  });
});
