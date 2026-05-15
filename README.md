# Gymflow Challenge

Gymflow Challenge is a shared Expo app for managing a small staff/member user list across web and native targets. It showcases Expo Router, React Native Web, NativeWind, MobX, Zod + React Hook Form, optional Supabase sync, persisted app preferences, solarized light/dark/auto themes, Motion/Reanimated animations, and Playwright/Detox smoke coverage. The core CRUD flow works without backend secrets; when Supabase env vars are present, the store can load and sync users remotely. The web build is static and can be deployed to GitHub Pages, including network-served painting assets used by the form parallax header.

## Install

```bash
npm ci
```

Use `npm ci` instead when you want a clean install from `package-lock.json`, such as in CI. If you get dependency/build issues (that might or might not be related to node and npm versions), I'd advise you to remove `node_modules` and `package-lock.json` and try your luck with `npm i`.

## Run In Development

Web:

```bash
npm run web
```

iOS simulator:

```bash
npm run ios
```

Android emulator:

```bash
npm run android
```

## Run On Real Devices

For the full native app with the same native modules used by simulator builds:

```bash
npm run ios -- --device
npm run android -- --device
```

For a quick Expo Go check, start the dev server with a tunnel and scan the QR code from the Expo Go app:

```bash
npx expo start --tunnel
```

## Tests

Unit and UI tests:

```bash
npm test
```

Lint and typecheck:

```bash
npm run lint
npx tsc --noEmit
```

All configured e2e tests:

```bash
npm run e2e:all
```

Web e2e only:

```bash
npm run e2e:web
```

iOS Detox e2e only:

```bash
npm run e2e:ios
```

Detox requires Xcode simulator tooling and `applesimutils`:

```bash
brew tap wix/brew
brew install applesimutils
```

## Docs

- [Challenge Spec](docs/CHALLENGE-SPEC.md)
- **[Post development review](docs/POST-DEVELOPMENT-REVIEW.md)**
- [What's being tested?](docs/TESTING.md)
- [(Codex-generated) implementation plan](docs/IMPLEMENTATION-PLAN.INITIAL.md), and [updated version](docs/IMPLEMENTATION-PLAN.REFINED.md)
- [Manual draft](docs/DRAFT-IMPLEMENTATION-PLAN.md) and [progress log](docs/.progress.log)
- [GitHub Pages deployment](docs/GITHUB-PAGES-DEPLOYMENT.md)
- [AGENTS.md](docs/AGENTS.md)