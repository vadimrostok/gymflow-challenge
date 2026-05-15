# How did we get here?

- I considered the challenge, desired time frame, and my past experience, settled on the initial set of dependencies and started the development based on Expo and as much as possible component re-usage (thanks to React Native Web).
My initial workflow:
- Draft implementation plan
- Discuss it with Codex and let it generate a refined version
- Go through the details, make required changes to the plan and let Codex do the initial implementation, including most of the boilerplate code and core functionality (users, pages).
- Then I spend my time analysing the output and choose some problems & features to be done manually to get my hands on the project and understand it better. This is the way I go about finding and understanding various pitfalls. This understanding usually proves to be important and useful. I'll add a list of such pitfalls later in this doc.
- From that point, I focused on web-based core functionality.
- Switched to multiple Codex agents running in parallel. In this phase, most of my time was spent finding and reporting problems to Codex, reading code and Codex chat output, resolving unavoidable worktree conflicts, and thinking about various improvements (additional features, UI changes, UX behaviour changes), writing things down for docs, myself (to keep things in mind), and Codex.
- Some problems are non-trivial, and Codex struggles to resolve them on its own. That's especially the case with UI problems, mobile issues, and other hard-to-verify problems. That's where I take over and let Codex work on other stuff. Then I either resolve it completely, understand what needs to be done and hand it off to Codex, or, after some considerable time is spent trying, switch Codex to a bigger, slower model and let dig deep into the problem, discuss possibilities, and in general, switch to async approach to save time (return to the problem only when Codex has something to say and I'm ready to switch away from another task I'm doing).
- For simple (obvious-how-to-do) problems, I use Codex-Spark; it's lightning fast, and I don't even have a chance to distract myself with something else. But in 75% of cases, tasks are not trivial, and I'm using Codex-5.5 at "high" speed, but even in "high" it often takes 10-15 mins to complete tricky stuff, so I'm parallelising as much as possible.
- I let Codex write useful unit/ui tests for key functionality (like form validation) right away and after we fix a non-obvious problem (it's always a good test case).
- When I'm more-or-less happy with the functionality of the app, I "bake" its capabilities with a "smoke" end-to-end test covering the most important scenarios.
- Then I switch to mobile development, running iOS sim and a real device. A bunch of easy-to-fix UI problems and a few tricky ones (like being unable to tap on any day on the datepicker, or a "dead" select ("picker" in mobile lingua)).
- After the core functionality is good and well on both platforms, there are working unit/ui/e2e tests, I can focus on additional improvements: an easter egg, a remote data storage, "secure mode", etc.
- I prepare GitHub actions to deploy the app for the web, serve images from GitHub pages to the mobile app (to decrease bundle size), add unit/ui, e2e-web, and e2e-mobile (detox) test runner actions, and add unit/ui as a guard for the `main` branch on GitHub.
- Do some final polishing and write this list.

# Important implementation notes

## User data storage

The app can store users in either Supabase or local SQLite. This is controlled from Settings via the "Remote data storage source" picker, and the selected source is persisted as an app preference. The MobX users store talks to the currently selected provider through a shared provider interface, so the user-facing CRUD flow stays the same regardless of whether the backing provider is remote or local.

Supabase is useful for remote persistence and web/mobile continuity when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured. SQLite is useful as a local-only fallback and for running the app without backend setup.

## Light, dark, and auto theme behavior

The light/dark/auto theme flow is slightly convoluted because web and native resolve "auto" differently.

On the web, auto mode is resolved through React Native's `useColorScheme()` hook, which React Native Web maps to the browser/system `prefers-color-scheme` value. That value becomes `resolvedColorScheme`, and then NativeWind's `setColorScheme(...)` receives the already-resolved `light` or `dark` value. In other words, web auto mode is resolved in JavaScript before it is passed to NativeWind.

On iOS, auto mode is delegated to the platform. When auto is enabled, the app calls NativeWind's `setColorScheme('system')` instead of forcing the current resolved value. iOS then applies the system appearance, which causes `useColorScheme()` to emit the actual `light` or `dark` value. Only after that does `resolvedColorScheme` become synchronized with the theme that iOS actually applied.

This is why the implementation does not simply call `setColorScheme(resolvedColorScheme)` in every case. Passing `system` is meaningful on native because iOS understands it as "follow system appearance"; on web, the equivalent behavior comes from listening to `prefers-color-scheme`.

## Theme providers and routing

There are two different theme-related providers, and they solve different problems.

`ThemeModeProvider` is the app-level theme provider. It lives in `components/app-providers.tsx`, is used by both native and web, owns `isAuto`, `resolvedColorScheme`, preference persistence, and calls NativeWind's `setColorScheme(...)`.

`ThemeProvider` from `@react-navigation/native` is the React Navigation theme provider. It lives in `app/_layout.tsx` and matters for the Expo Router / native stack UI, especially native headers. It is not the source of truth for the app theme; it adapts React Navigation chrome to the app's resolved theme.

The platform routing split is also important. Native uses Expo Router and the stack layout in `app/_layout.tsx`. Web uses `App.web.tsx`, React Router, and web-specific header/layout components, so web does not go through the native stack layout. Both platforms still share the app-level providers through `AppProviders`.

## An easter egg
Try holding the "Add user" button on mobile for a few seconds and you'll see it.