const { by, device, element, expect, waitFor } = require('detox');

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
    try {
      await waitFor(element(by.id('ios_picker'))).toBeVisible().withTimeout(1000);
    } catch (_error) {
      await element(by.id('role-picker')).tap();
    }

    await waitFor(element(by.id('ios_picker'))).toBeVisible().withTimeout(2500);
    await element(by.id('ios_picker')).setColumnToValue(0, role);
    await element(by.id('done_button')).tap();
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
    await expect(element(by.text(userName))).not.toExist();

    // Create valid user
    await element(by.id('users-add-button')).tap();
    await element(by.id('full-name-input')).replaceText(userName);
    await pickRole('Staff');
    await tapFormButton('users-form-submit-create');

    await expect(element(by.text(userName))).toBeVisible();

    // Edit existing user (invalid save first, then valid)
    await element(by.text(userName)).tap();
    await waitFor(element(by.id('full-name-input'))).toBeVisible().withTimeout(5000);

    await element(by.id('full-name-input')).replaceText('AB');
    await tapFormButton('users-form-submit-save');
    await waitFor(element(by.text('Full name must be at least 3 characters.'))).toBeVisible().withTimeout(5000);

    await element(by.id('full-name-input')).replaceText(updatedUserName);
    await tapFormButton('users-form-submit-save');

    await expect(element(by.text(updatedUserName))).toBeVisible();

    // Confirm delete button not available before settings toggle
    await expect(element(by.label(`Remove ${updatedUserName}`))).not.toExist();

    // Theme button emoji sanity checks
    const themeButton = element(by.id('theme-mode-toggle'));
    const themeSymbolBefore = await readElementText(themeButton);

    await themeButton.tap();
    const themeSymbolAfter = await readElementText(themeButton);
    await expect(themeSymbolAfter).not.toEqual(themeSymbolBefore);

    await themeButton.tap();
    const themeSymbolAfterSecond = await readElementText(themeButton);
    await expect(themeSymbolAfterSecond).toEqual(themeSymbolBefore);

    // Enable delete button in settings
    await element(by.id('settings-button')).tap();
    await waitFor(element(by.id('users-list-delete-toggle'))).toBeVisible().withTimeout(5000);

    const deleteToggleChecked = (await element(by.id('users-list-delete-toggle')).getAttributes()).accessibilityState
      ?.checked;
    if (!deleteToggleChecked) {
      await element(by.id('users-list-delete-toggle')).tap();
    }

    await element(by.id('app-header-back')).tap();
    await expect(element(by.label(`Remove ${updatedUserName}`))).toExist();

    // Cancel delete action
    await element(by.label(`Remove ${updatedUserName}`)).tap();
    await confirmDelete('Cancel', 'delete-user-dialog-cancel');
    await expect(element(by.text(updatedUserName))).toExist();

    // Confirm delete action
    await element(by.label(`Remove ${updatedUserName}`)).tap();
    await confirmDelete('Remove', 'delete-user-dialog-confirm');
    await waitFor(element(by.text(updatedUserName))).toNotExist().withTimeout(5000);
    await expect(element(by.text(updatedUserName))).not.toExist();
  });
});
