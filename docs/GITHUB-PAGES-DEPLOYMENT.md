# GitHub Pages Deployment

## What The Workflow Does

The workflow in `.github/workflows/deploy-github-pages.yml` builds the Expo web app as static files, copies `assets/paintings` into `dist/assets/paintings`, adds `404.html` for client-side routes, and deploys `dist` to GitHub Pages.

For a repository named `gymflow-challenge`, the web app is built with:

- `EXPO_PUBLIC_WEB_BASE_PATH=/gymflow-challenge`
- `EXPO_PUBLIC_WEB_PAINTINGS_PATH_BASE=/gymflow-challenge/assets/paintings`
- `EXPO_PUBLIC_PAINTINGS_URL_BASE=https://<owner>.github.io/gymflow-challenge`

The web app uses the relative Pages path for painting images. Native builds should use the absolute `EXPO_PUBLIC_PAINTINGS_URL_BASE` value so images are fetched over the network from the deployed site.

## Required GitHub Secrets

Add these repository secrets in GitHub:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

GitHub path:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Go to `Secrets and variables` -> `Actions`.
4. Click `New repository secret`.
5. Add each secret name exactly as listed above.

## Important Supabase Note

`EXPO_PUBLIC_*` values are embedded into the static web bundle at build time. GitHub Actions secrets keep them out of the repository and logs, but the final web app can still read them in the browser. Use the Supabase publishable/anon key only, never a service-role key, and rely on Supabase Row Level Security policies for data protection.

## Manual Build

To build locally:

```sh
EXPO_PUBLIC_WEB_BASE_PATH=/gymflow-challenge \
EXPO_PUBLIC_WEB_PAINTINGS_PATH_BASE=/gymflow-challenge/assets/paintings \
EXPO_PUBLIC_PAINTINGS_URL_BASE=https://<owner>.github.io/gymflow-challenge \
npm run build:web:github
```

The deployable files will be in `dist`.
