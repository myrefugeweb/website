# Help Center Screenshots

The Admin Help Center can display static screenshots and animated demos from:

```text
public/help/screenshots/<topic-id>.png
public/help/screenshots/<topic-id>.gif
```

Screenshots are generated from the `screenshotTarget` values in `src/data/adminHelpTopics.ts`. Topics marked with `animated: true` also generate multiple Playwright frames and encode them into GIF demos. When a GIF is missing, the Help Center falls back to the PNG; when both are missing, it shows a labeled placeholder so the page always renders.

## Generate Screenshots

1. Start the dev server.
2. Make sure Playwright browsers are installed:

```bash
npx playwright install chromium
```

3. Save an authenticated session once (headed browser):

```powershell
$env:HELP_SCREENSHOT_BASE_URL="http://localhost:5178"
npm run help-screenshots:auth
```

4. Capture screenshots and animated demos:

```powershell
$env:PLAYWRIGHT_STORAGE_STATE="playwright/.auth/admin.json"
$env:HELP_SCREENSHOT_BASE_URL="http://localhost:5178"
npm run help-screenshots
```

Alternatively, provide credentials directly:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="your-password"
$env:HELP_SCREENSHOT_BASE_URL="http://localhost:5178"
npm run help-screenshots
```

The script reads screenshot targets from `src/data/adminHelpTopics.ts`, navigates to the relevant dashboard tab or modal, and writes screenshots into `public/help/screenshots`.

Animated help topics write temporary source frames into `scripts/gif-frames/<topic-id>` and then generate `public/help/screenshots/<topic-id>.gif`. To capture only static screenshots without rebuilding GIFs, set:

```powershell
$env:SKIP_HELP_GIFS="1"
```

If an account is forced to change its password, complete that step manually before running the script.
