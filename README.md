# Gymflow Challenge

Shared Expo app for the Gymflow frontend task. The first implementation iteration includes the required users list, create/edit form, Zod validation, MobX state, responsive React Native Web UI, a layout-level theme switcher, and smoke tests.

## Run

```bash
npm install
npm run web
```

Expo can also launch native targets:

```bash
npm run ios
npm run android
```

## Test

```bash
npm run lint
npm test
npx tsc --noEmit
```

## Current Scope

- `/` redirects to `/users`.
- `/users` shows the staff/member list and list-item remove actions.
- `/users/new` creates a user.
- `/users/[id]` edits a user and includes a form-level remove action.
- The header theme button cycles auto, light, and dark modes on every screen.

SQLite persistence, Supabase auth/sync, secure mode, deep-link export, Playwright, and Detox are planned next. See [docs/IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md).
