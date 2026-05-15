# Gymflow Implementation Plan

## Summary

The implemented app is a shared Expo Router application for user-list CRUD across web and native targets. It keeps the challenge flow usable without backend secrets, while showcasing NativeWind styling, MobX state, Zod + React Hook Form validation, optional Supabase user sync, persisted app preferences, solarized light/dark/auto theming, Motion/Reanimated animations, a network-loaded painting header, and smoke coverage with Jest, Testing Library, Playwright, and Detox.

The original draft was intentionally broader than the final challenge build. The final implementation favors a polished CRUD core and visible cross-platform behavior over unfinished auth, biometric lock, and full offline sync infrastructure.

## Implemented Scope

- Routes:
  `/` redirects into the users area, `/users` lists users, `/users/new` creates a user, `/users/[id]` edits a user, and `/settings` stores local app preferences.
- Layout:
  the shared header owns the title/back behavior and the light/dark/auto theme controls. The shared footer sits at the end of the page content and is pushed to the viewport bottom on short pages.
- User domain:
  users have `id`, `fullName`, `role: STAFF | MEMBER`, optional ISO `dateOfBirth`, `createdAt`, and `updatedAt`. Deletes remove users from the active store and remote table instead of using a `deleted_at` flag.
- State and sync:
  `UsersStore` is MobX-backed. Supabase is optional and is enabled only when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` exist. Without those env vars, CRUD remains available in local in-memory mode.
- Preferences:
  preferences are generic app preferences, not theme-only preferences. Web uses `localStorage`; native uses `expo-sqlite/kv-store`. Persisted fields currently include theme mode, auto-theme mode, and whether list-item delete buttons are visible.
- Styling:
  NativeWind is used for most layout and styling, with targeted inline/platform styles where React Native, date picker internals, or web motion APIs need them. The palette remains solarized-inspired and shared color constants are centralized in `constants/theme.ts`.
- Forms:
  create/edit uses React Hook Form, Zod schema validation, optional birthday selection, a platform-aware role picker, date picker styling for light/dark modes, delete confirmation in edit mode, and keyboard dismissal support on native.
- Animations:
  web animations use `motion`; native animations use Reanimated through platform-specific wrappers. Covered interactions include page entry, list loading, user deletion, delete confirmation, theme transitions, picker sheet behavior, and the form painting parallax header.
- Painting assets:
  form pages rotate through `assets/paintings` metadata. Web uses relative static asset paths in production, while native fetches from `EXPO_PUBLIC_PAINTINGS_URL_BASE`.
- GitHub Pages:
  the static web export copies painting assets, writes `404.html` for client-side routes, and uses the documented Pages base-path env vars.
- CI:
  GitHub Actions includes a unit/UI workflow and an e2e workflow. The e2e workflow runs Playwright and Detox iOS on a macOS runner with a dynamically created simulator.

## Differences From The Initial Draft

- Full SQLite user persistence was not implemented. SQLite is currently used for native app preferences; users are either in memory or synced through Supabase when configured.
- Supabase auth and OAuth buttons were not implemented. Supabase integration is currently direct optional data sync with public Expo env vars.
- Secure mode / biometric app lock was not implemented. The settings screen keeps only the completed local preference controls.
- Native deep-link routing is available through Expo Router and the `gymflowchallenge` scheme, but the planned native share/export button was omitted.
- Android Detox is not configured yet. The active mobile e2e target is iOS Detox.
- The original Recia font experiment was replaced with Rubik.

## Public Interfaces

- Environment:
  `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_WEB_BASE_PATH`, `EXPO_PUBLIC_WEB_PAINTINGS_PATH_BASE`, and `EXPO_PUBLIC_PAINTINGS_URL_BASE`.
- Supabase table:
  `users` with `id`, `createdAt`, `updatedAt`, `fullName`, `role`, and nullable `dateOfBirth`.
- Preferences key:
  `gymflow.preferences`.
- Scheme:
  `gymflowchallenge`.

## Scripts

- `npm run web` starts Expo web development.
- `npm run ios` starts an iOS simulator/native build.
- `npm run android` starts an Android emulator/native build.
- `npm run build:web` exports static web output.
- `npm run build:web:github` exports static web output and prepares GitHub Pages assets.
- `npm run lint` runs Expo ESLint.
- `npm test` runs unit and UI tests.
- `npm run e2e:web` runs Playwright.
- `npm run e2e:ios` builds and runs Detox iOS.
- `npm run e2e:all` runs Playwright and Detox iOS.

## Test Plan

- Unit/schema coverage:
  user validation, birthday formatting, theme constants, preferences hydration/persistence, and MobX store create/update/delete/sync behavior.
- UI smoke coverage:
  user form behavior, user form page shell native behavior, theme mode button, and validation errors.
- Web e2e:
  Playwright covers the main user lifecycle: create, edit, validate theme controls, toggle list-delete preference, and delete.
- Mobile e2e:
  Detox iOS covers the same challenge-level user lifecycle on a simulator.
- Verification before handoff:
  run `npm run lint`, `npx tsc --noEmit`, `npm test -- --runInBand`, `npm run e2e:web`, and `npm run e2e:ios` when native simulator prerequisites are available.

## Remaining Follow-Ups

- Add real offline user persistence if local user data should survive app restarts without Supabase.
- Add authenticated Supabase flows and Row Level Security policy documentation before using remote data for real users.
- Decide whether secure mode should be implemented as a real biometric app lock or removed from the roadmap entirely.
- Add Android Detox only after the Android native flow is actively needed.
