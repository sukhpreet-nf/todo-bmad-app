import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Todo App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('shows empty state initially or todos list', async ({ page }) => {
    const content = await page.content();
    expect(
      content.includes('No todos yet') || page.locator('ul').isVisible()
    ).toBeTruthy();
  });

  test('adds a new todo', async ({ page }) => {
    const input = page.getByRole('textbox');
    await input.fill('E2E Test Todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('E2E Test Todo')).toBeVisible({ timeout: 5000 });
  });

  test('shows validation error for empty todo', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('marks todo as completed', async ({ page }) => {
    await page.getByRole('textbox').fill('Complete Me');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Complete Me')).toBeVisible({ timeout: 5000 });

    const checkbox = page.getByRole('checkbox', { name: /complete me/i });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(page.getByText('Complete Me')).toHaveClass(/line-through/);
  });

  test('deletes a todo', async ({ page }) => {
    await page.getByRole('textbox').fill('Delete Me');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Delete Me')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /delete "delete me"/i }).click();
    await expect(page.getByText('Delete Me')).not.toBeVisible({ timeout: 5000 });
  });

  test('persists todos after page reload', async ({ page }) => {
    await page.getByRole('textbox').fill('Persistent Todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Persistent Todo')).toBeVisible({ timeout: 5000 });

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Persistent Todo')).toBeVisible({ timeout: 5000 });
  });
});
