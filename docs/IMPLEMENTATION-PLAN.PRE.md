# Gymflow Full Draft Implementation Plan

## Summary

Build the full shared Expo app from the draft, but stage it so the required challenge works first and remains usable without external secrets. The app will use Expo Router for web/mobile routes, MobX for hot user state, SQLite for local persistence, Zod + React Hook Form for validation, Supabase auth/sync when env vars are present, light/dark/auto theming, secure-mode settings, deep-link export, animations, README updates, and smoke coverage with Jest, Testing Library, Playwright, and Detox.

Important opinion: the full draft is much larger than the original challenge. To keep it reviewable, auth/sync/secure mode/deep links should be implemented as polished additions around a simple core CRUD app, not as the foundation that can block the required list/form flows.

## Key Changes

- Replace the Expo starter tabs with a stack route tree:
  `/` redirects to `/users`, `/users` lists users, `/users/new` creates users, `/users/[id]` edits users, `/settings` controls secure mode. Keep the light/dark/auto theme button in the shared layout header so it is available on every screen, not inside settings.
- Add shared user domain modules:
  user schema with `fullName`, `role: STAFF | MEMBER`, optional ISO `dateOfBirth`, `id`, `updatedAt`, sync metadata; MobX `UsersStore`; repository interfaces for SQLite and Supabase-backed sync.
- Implement UI:
  responsive list/table using React Native primitives and `FlatList`, reusable create/edit form, validation errors, delete confirmation per platform, remove buttons on list items and on the edit form, loading placeholders, bottom error banner for sync failures, solarized-inspired light/dark/auto theme toggle in the shared layout, settings button, and one Reanimated transition for route/list/form feedback.
- Implement persistence and sync:
  SQLite is source of local startup data; Supabase is enabled only when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` exist. Without env vars, app runs fully in local mode. With Supabase, local edits save immediately, then sync; remote differences merge by `updatedAt`. Deleting a user removes the row from SQLite and Supabase rather than hiding it behind a deletion flag.
- Implement auth:
  Google and Apple Supabase OAuth buttons appear when Supabase is configured. Apple is shown only where supported. Auth state controls remote sync, not local CRUD availability.
- Implement secure mode carefully:
  use `expo-local-authentication` and `expo-secure-store`. Secure mode locks the app when backgrounded and requires biometric unlock before showing synced/private state again. Do not pretend biometrics replace OAuth; if biometric unlock fails or no session exists, fall back to OAuth buttons.
- Implement deep links:
  configure the existing `gymflowchallenge` scheme, support `/users/[id]`, and add a native-only export/share button on saved user edit screens. Web relies on the browser URL.
- Clean dependencies:
  keep useful packages already added, replace placeholder `testing-library` with `@testing-library/react-native`, and add required resolver/testing/auth packages such as `@hookform/resolvers`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill`, `expo-local-authentication`, and `expo-secure-store`.

## Public Interfaces

- Environment:
  `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, optional OAuth redirect configuration documented in `.env.example` and README.
- Local database:
  SQLite `users` table with `id`, `full_name`, `role`, nullable `date_of_birth`, `updated_at`, and sync status/error fields.
- Supabase expectation:
  `users` table with matching fields plus `owner_id`; README includes SQL setup and RLS policy notes for per-user access.
- Scripts:
  add `test`, `test:watch`, `test:e2e:web`, `test:e2e:mobile`, keep `lint`, and document platform run commands.

## Test Plan

- Unit tests:
  Zod validation accepts valid users and rejects invalid name/role/date; MobX store create/update/delete updates observable state and calls repositories.
- UI smoke tests:
  render list empty/loading states, render create/edit form, show validation errors, submit valid form, show list-item remove actions, and show the form-level remove button only in edit mode.
- Web e2e:
  Playwright starts Expo web, creates multiple users, opens edit route, navigates back, deletes a user, verifies list state, and runs in local mode without auth.
- Mobile e2e:
  Detox smoke flow for iOS simulator first: launch app, create a user, edit it, delete it, verify screen state. Auth flow is skipped unless test Supabase env vars are present.
- Verification before summary:
  run `npm run lint`, `npm test`, `npm run test:e2e:web`, and run Detox if simulator/build prerequisites are available; report any unavailable native prerequisites explicitly.

## Assumptions

- Supabase is optional at runtime; the app must still satisfy the challenge in local SQLite mode.
- Sync conflict rule is last-write-wins by `updatedAt`; deletes remove local and remote rows completely.
- Secure mode is a biometric app lock over the persisted session, not a biometric replacement for Google/Apple OAuth.
- Detox setup may require local simulator/tooling; implementation will include config and a smoke test, with README troubleshooting if the host cannot run it immediately.
- The final README should lead with how to run/review the required app, then document Supabase, secure mode, deep links, and e2e setup as advanced sections.