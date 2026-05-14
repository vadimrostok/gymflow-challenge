import { expect, type Page, test } from '@playwright/test';

const now = Date.now();
const userName = `E2E Full Flow ${now}`;
const updatedUserName = `E2E Full Flow ${now} (Edited)`;
const shortNameError = 'Full name must be at least 3 characters.';

async function fillName(page: Page, name: string) {
  await page.getByTestId('full-name-input').fill(name);
}

async function submitVisibleForm(page: Page, testId: string) {
  const button = page.getByTestId(testId);
  await button.scrollIntoViewIfNeeded();
  await button.click();
}

async function chooseRole(page: Page, role: 'Staff' | 'Member') {
  await page.getByTestId('role-picker').selectOption({ label: role });
}

test.describe('Gymflow users lifecycle flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/users');
    await expect(page.getByTestId('users-add-button')).toBeVisible();
  });

  test('creates, edits, validates theme button state, toggles delete setting, and deletes users', async ({ page }) => {
    // Invalid create -> confirm validation message
    await page.getByTestId('users-add-button').click();
    await expect(page.getByTestId('full-name-input')).toBeVisible();

    await fillName(page, 'JD');
    await submitVisibleForm(page, 'users-form-submit-create');
    await expect(page.getByText(shortNameError)).toBeVisible();

    await submitVisibleForm(page, 'users-form-cancel');
    await expect(page.getByText(userName)).toHaveCount(0);

    // Create valid user
    await page.getByTestId('users-add-button').click();
    await fillName(page, userName);
    await chooseRole(page, 'Staff');
    await submitVisibleForm(page, 'users-form-submit-create');

    await expect(page.getByText(userName)).toBeVisible();

    // Edit existing user (invalid save first, then valid)
    await page.getByText(userName).click();
    await expect(page.getByTestId('full-name-input')).toBeVisible();

    await fillName(page, 'AB');
    await submitVisibleForm(page, 'users-form-submit-save');
    await expect(page.getByText(shortNameError)).toBeVisible();

    await fillName(page, updatedUserName);
    await submitVisibleForm(page, 'users-form-submit-save');

    await expect(page.getByText(updatedUserName)).toBeVisible();

    // Confirm delete button not available before settings toggle
    await expect(page.getByLabel(`Remove ${updatedUserName}`)).toHaveCount(0);

    // Theme button emoji sanity checks
    const themeButton = page.getByTestId('theme-mode-toggle');
    const themeLabelBefore = await themeButton.getAttribute('aria-label');

    await themeButton.click();
    await expect(themeButton).not.toHaveAttribute('aria-label', themeLabelBefore ?? '');

    await themeButton.click();
    await expect(themeButton).toHaveAttribute('aria-label', themeLabelBefore ?? '');

    // Enable delete button in settings
    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('users-list-delete-toggle')).toBeVisible();
    await page.getByTestId('users-list-delete-toggle').click();
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByLabel(`Remove ${updatedUserName}`)).toBeVisible();

    // Cancel delete action
    await page.getByLabel(`Remove ${updatedUserName}`).click();
    await page.getByTestId('delete-user-dialog-cancel').click();
    await expect(page.getByLabel(`Open ${updatedUserName} profile`)).toBeVisible();

    // Confirm delete action
    await page.getByLabel(`Remove ${updatedUserName}`).click();
    await page.getByTestId('delete-user-dialog-confirm').click();
    await expect(page.getByLabel(`Open ${updatedUserName} profile`)).toHaveCount(0);
  });
});
