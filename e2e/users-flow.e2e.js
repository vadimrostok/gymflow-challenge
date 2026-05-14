const assert = require('node:assert/strict');
const { by, device, element, expect: detoxExpect, waitFor } = require('detox');

const now = Date.now();
const userName = `E2E Full Flow ${now}`;
const updatedUserName = `E2E Full Flow ${now} (Edited)`;

async function readElementText(selector) {
  const attributes = await selector.getAttributes();
  return `${attributes.text ?? attributes.label ?? attributes.value ?? ''}`.trim();
}

async function pickRole(role) {
  await element(by.id('role-picker')).tap();

  if (device.getPlatform() === 'ios') {
    await waitFor(element(by.id('role-picker-done'))).toBeVisible().withTimeout(2500);
    try {
      await element(by.id('role-picker-modal')).setColumnToValue(0, role);
    } catch (_error) {
      await element(by.text(role)).atIndex(0).tap();
    }
    await element(by.id('role-picker-done')).tap();
    return;
  }

  try {
    await waitFor(element(by.text(role))).toBeVisible().withTimeout(2500);
    await element(by.text(role)).tap();
    return;
  } catch (_error) {
    await element(by.id('role-picker')).replaceText(role);
  }
}

function isMobilePlatform() {
  const platform = device.getPlatform();
  return platform === 'ios' || platform === 'android';
}

async function confirmDelete(actionLabel, fallbackTestId) {
  if (isMobilePlatform()) {
    await waitFor(element(by.text(actionLabel))).toBeVisible().withTimeout(2500);
    await element(by.text(actionLabel)).tap();
    return;
  }

  await waitFor(element(by.id(fallbackTestId))).toBeVisible().withTimeout(2500);
  await element(by.id(fallbackTestId)).tap();
}

async function tapFormButton(testId) {
  await waitFor(element(by.id(testId)))
    .toBeVisible()
    .whileElement(by.id('user-form-scroll'))
    .scroll(350, 'down');
  await element(by.id(testId)).tap();
}

describe('Gymflow users lifecycle flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  it('creates, edits, validates theme button state, toggles delete setting, and deletes users', async () => {
    await waitFor(element(by.id('users-add-button'))).toBeVisible().withTimeout(15000);

    // Invalid create -> confirm validation message
    await element(by.id('users-add-button')).tap();
    await waitFor(element(by.id('full-name-input'))).toBeVisible().withTimeout(5000);

    await element(by.id('full-name-input')).replaceText('JD');
    await tapFormButton('users-form-submit-create');
    await waitFor(element(by.text('Full name must be at least 3 characters.'))).toBeVisible().withTimeout(5000);

    await tapFormButton('users-form-cancel');
    await detoxExpect(element(by.text(userName))).not.toExist();

    // Create valid user
    await element(by.id('users-add-button')).tap();
    await element(by.id('full-name-input')).replaceText(userName);
    await pickRole('Staff');
    await tapFormButton('users-form-submit-create');

    await detoxExpect(element(by.text(userName))).toBeVisible();

    // Edit existing user (invalid save first, then valid)
    await element(by.text(userName)).tap();
    await waitFor(element(by.id('full-name-input'))).toBeVisible().withTimeout(5000);

    await element(by.id('full-name-input')).replaceText('AB');
    await tapFormButton('users-form-submit-save');
    await waitFor(element(by.text('Full name must be at least 3 characters.'))).toBeVisible().withTimeout(5000);

    await element(by.id('full-name-input')).replaceText(updatedUserName);
    await tapFormButton('users-form-submit-save');

    await detoxExpect(element(by.text(updatedUserName))).toBeVisible();

    // Confirm delete button not available before settings toggle
    await detoxExpect(element(by.label(`Remove ${updatedUserName}`))).not.toExist();

    // Theme button emoji sanity checks
    const themeButton = element(by.id('theme-mode-toggle'));
    const themeSymbolBefore = await readElementText(themeButton);

    await themeButton.tap();
    const themeSymbolAfter = await readElementText(themeButton);
    assert.notEqual(themeSymbolAfter, themeSymbolBefore);

    await themeButton.tap();
    const themeSymbolAfterSecond = await readElementText(themeButton);
    assert.equal(themeSymbolAfterSecond, themeSymbolBefore);

    // Enable delete button in settings
    await element(by.id('settings-button')).tap();
    await waitFor(element(by.id('users-list-delete-toggle'))).toBeVisible().withTimeout(5000);

    const deleteToggleChecked = (await element(by.id('users-list-delete-toggle')).getAttributes()).accessibilityState
      ?.checked;
    if (!deleteToggleChecked) {
      await element(by.id('users-list-delete-toggle')).tap();
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    await element(by.id('app-header-back')).tap();
    await waitFor(element(by.label(`Remove ${updatedUserName}`))).toExist().withTimeout(5000);

    // Cancel delete action
    await element(by.label(`Remove ${updatedUserName}`)).tap();
    await confirmDelete('Cancel', 'delete-user-dialog-cancel');
    await detoxExpect(element(by.text(updatedUserName))).toExist();

    // Confirm delete action
    await element(by.label(`Remove ${updatedUserName}`)).tap();
    await confirmDelete('Remove', 'delete-user-dialog-confirm');
    await waitFor(element(by.text(updatedUserName))).toNotExist().withTimeout(5000);
    await detoxExpect(element(by.text(updatedUserName))).not.toExist();
  });
});
