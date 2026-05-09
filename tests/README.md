# SkippyMD E2E Tests

Playwright-based end-to-end tests for the SkippyMD browser extension.

## Prerequisites

- Node.js and npm installed
- Dependencies installed: `npm install`
- Chromium browser (installed via `npx playwright install chromium`)
- Xvfb running on DISPLAY :99 (for headless testing on Linux servers)

## Running Tests

```bash
# Run all tests (requires DISPLAY :99)
npm test

# Or set DISPLAY manually
DISPLAY=:99 npm test

# Run in headed mode (requires X server)
npm run test:headed

# Debug mode
npm run test:debug
```

## Starting Xvfb (Linux only)

If you don't have an X server running:

```bash
Xvfb :99 -screen 0 1920x1080x24 &
export DISPLAY=:99
```

## Test Coverage

The test suite covers:

1. ✅ Extension loads successfully
2. ✅ Renders basic markdown (headings, paragraphs, bold, italic)
3. ✅ Code syntax highlighting works
4. ✅ KaTeX math rendering works
5. ✅ Mermaid diagrams render
6. ✅ Table of Contents exists and works
7. ✅ Dark/Light theme toggle works
8. ✅ Tables render correctly
9. ✅ Task lists render with checkboxes
10. ✅ Emoji rendering works

## How It Works

- Tests load the extension into Chromium using `launchPersistentContext`
- Extension must be unpacked (not a .crx file)
- Tests navigate to `file:///path/to/sample.md`
- Extension intercepts the .md file and redirects to `chrome-extension://*/viewer.html`
- Tests verify the rendered output

## Known Issues

- Extensions don't work in headless mode, so we use headed mode with Xvfb
- `chrome.storage.local` is used instead of `sessionStorage` to share content between file:// and chrome-extension:// origins

## Debugging

Screenshots on failure are saved to `test-results/*/test-failed-*.png`

To see what's happening:
```bash
DISPLAY=:99 npx playwright test --headed
```
