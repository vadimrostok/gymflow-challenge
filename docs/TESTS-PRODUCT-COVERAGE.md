# Tests And Product Coverage

## Unit Tests

- Theme color sanity checks keep filled button text readable in light and dark modes.
- User schema tests cover valid payloads and reusable validation messages for invalid names, roles, and birthday dates.
- Preference parsing tests cover valid persisted preferences, malformed JSON, stable storage key, and invalid theme data that should not discard other preferences.
- Date parsing tests cover the date-picker value conversion path, including empty values and same-day ISO output.
- Users store tests cover MobX state updates, optimistic create/update/delete behavior, Supabase mirroring, temporary sync errors, delete promise ordering, and stale-load race protection.

## Testing Library UI Tests

- Theme button tests cover hover preview behavior without accidentally applying the previewed theme.
- Theme mode provider tests cover hydration, persistence, theme cycling, auto mode, and preserving unrelated preferences when theme values are saved.
- User form tests cover valid submission, invalid submission errors, submit disabled state after validation, and edit-mode removal.
- User list item tests cover row navigation into the edit screen.
- Settings screen tests cover persisted preference updates and secure-mode local-auth success/cancel behavior.
- App lock tests cover unlocked startup, successful authentication, failed authentication fallback UI, and re-authentication after returning from background.
- Native user form page shell tests are not classic Testing Library interaction tests, but they protect a real mobile layout/parallax regression.

## E2E Tests

- Playwright covers the core web user lifecycle: create, edit, theme-control smoke checks, list-delete preference, and delete.
- Detox covers the same challenge-level user lifecycle on iOS.
