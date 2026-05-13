# DRAFT iteration 1
- Recap your understanding of the challenge & discuss possible solutions with AI.
- Settled on key tech: Expo, Expo Router, React Native Web (to reuse components as much as possible), use StyleSheet, single route tree, different routing-related layouts (e.g. breadcrumbs for web, stacks for mobile).
- Think through the initial UI prototype, the required components & their relation to routes
- Init expo app (default template)
- Deps:
  - react-native-web
  - react-hook-form (formik substitute)
  - zod (json-schema substitute)
  - tailwind (styling)
  - mobx
  - luxon (data/time/timezone, moment substitute (i know moment is deprecated))
  - reanimated (animations)
  - testing
    - jest: unit tests for generic logic
    - testing-library for ui stuff
    - playwright for web e2e
    - detox for mobile e2e
- Routes:
  - / -> /users/
    - /users/new
    - /users/:id
- Animations:
  - delete user
  - add user
  - users list loaded
  - going back and forth through stack (mobile)
  - splash screen
  - background -> foreground
- Docs:
  - _this_ (meta)
  - AI-honed implementation plan
  - README with installation, running instructions
  - REVIEW + next steps (expo eject? nx? alt tech stacks?)
- Confirmation
  - deletion (action sheet for ios?)
- Styling
  - auto light/dark mode
- Data storage
  - NSUserDefaults?
  - async storage
  - sqlite?
  - mmkv?
  - firebase/securestore
- Deep linking (e.g. com.vadymrostok.gymchlg/users/123 -> in-app)
- Backend integration
  - auth (google/apple)
    - expo auth session
    - oauth, webflow?, verify token on backend
    - (nope!) api key? signature timestamp + time checks? biometrics-only?
    - biometrics? but for what? deleting users? logging in after a timeout? "secure mode"?
  - firebase?
  - (most likely) superbase?
  - nodejs + sqlite/mongo?
  - aws amplify?
- Some native module(s) integration to spice things up?

# DRAFT iteration 2
1. Install deps:
- deps: `npm i --save mobx-react-lite @supabase/supabase-js expo-sqlite react-native-web react-hook-form zod nativewind mobx luxon reanimated`
- dev deps: `npm i --save-dev detox jest playwright @types/detox @types/playwright @types/jest @types/jest-react-native @types/react-native @types/react-native-web @types/react-hook-form @types/zod @types/nativewind @types/mobx @types/luxon @types/reanimated `
1.1 Install dev tools:
  - Eslint with some reasonable common config
  - Add git hooks (lint-staged on commit, all tests on push)
2. Create routes:
- / & /users -> UsersList
- /users/new -> UserForm
- /users/:id -> UserForm
3. Create components with boilerplate code:
- UserForm
- UserListItem
- UsersList
4. Confirm it works on both platforms (so far).
7. Data storage.
  - Reflect current users state (and edited-user?) in MobX
5. UserForm UI.
  - Use luxon for date picking.
  - Tailwind styling.
  - Labels, titles, buttons, error texts.
  - Add testing library UI test confirming form is rendered.
6. UserForm event handlers and state management.
  - Zod-based validation.
  - React Hook Form for triggering validation and submission.
  - On submission update MobX store and notify parent component/emit event to trigger BE persistence.
  - Use optimistic update, rollback and show error if failed.
  - Leaving a "dirty" form triggers confirmation on the web, action sheet on mobile.
  - Add jest tests confirming that valid form submission results in MobX store update, while invalid does not.
  - Add testing library UI test confirming form validation is showing error text.
7. UsersList UI
  - UserListItem as separate component with delete button.
  - Delete user confirmation modal (for web), and action sheet (for iOS & smth for Android).
  - Use FlatList
  - Use visual block placeholders and loading spinner while users are loading.
  - Switch between UserForm and UsersList has to be stack-animated on mobile. And something completely different for web.
8. UsersList event handlers and state management.
  - User deletion triggers confirmation.
  - Many users loaded in batches with infinite scrolling. Albeit initial view height is calculated by getting the full user list length from BE.
9. Reanimated animations:
  - Deleting a user fades opacity and animates list reconciliation.
  - Adding a user animates list reconciliation.
  - Loading users list animates loading spinner.
  - Splash screen is a static image/text, but when UI's ready it scrolls into view from the bottom of the screen.
  - When app goes from background to foreground it fades from white.
10. Docs:
  - Update README with what's done and possible so far. Keep the most important information at the beginning.
11. List/Dark mode.
  - Round icon button at the top right corner iterates through light, dark, and auto modes.
  - Feel free to come up with colors configuration, but I do like solarized color schemes.
  - If possible - animate colors switching transition.
14. Auth:
  - Google/Apple auth through Supabase. When user is authenticated, user data is synced with the server. Use typical log in with Google/Apple buttons with icons, feel free to install fontawesome or other deps if needed.
12. Supabase data storage:
  - MobX should be used for "hot" state management, Subpabase (sqlist, locally) should be used for long-term storage: loading data when app starts, updating data when user is updated/deleted.
  - Supabase backend features should be used as optimistic backup: initially data is loaded from squlite, but data from BE is loaded as well, asynchronously, and is compared with local state, local state is updated, if diverging. BE updates happen alongside local sqlite updates: change/delete user.
  - BE errors should be shown temporarily in the bottom of the screen in red over a white stripe for a few seconds.
13. Deep linking:
  - UserForm for existing (or just-saved) users should include "export" button that would open native dialog to save/send deep link to the user route on the mobile. On the web we won't show this button (URL can be copied if needed).
14. Settings page:
  - Round button on the left of the light/dark mode button leads to the settings page.
  - So far it'd have only a single checkbox: secure mode. When enabled, user is logged out each time the app is closed/goes into background. When enabling, user is asked for permission to use biometric authentication for login. If allowed, user is logged in via FaceId/Fingerprint instead of Google/Apple auth buttons.
15. Update README
16. Add web and mobile e2e smoke tests. It should go through auth (if we can simulate it easily, otherwise let's skip auth), creates a few users, goes back and forth between pages, deletes a user, test confirms UI state at each step.

# iteration 3 (post boilerplate generation)
- layout
  - limit list width and centre on web
  - add settings button near theme button
  - userform: remove button near the name, red, icon, with tooltip
- make light/dark mode button 2-state and add "auto" checkbox nearby, when enabled button inactive
- "state" vs "features" folders, wtf
- components/ui? why "ui"?
- general styling: 
  - fonts
  - remove button should be icon with tooltip
  - flexboxing does not flexboxin in user list item
  - fix non-contrasty color combinations
- theme-mode -> theme-context
