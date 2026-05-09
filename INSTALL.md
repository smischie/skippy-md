# Quick Installation Guide

## Step 1: Load Extension

1. Open Chrome or Edge
2. Navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `/home/sorin/projects/skippy-md/` folder
6. ✅ Extension loaded!

## Step 2: Enable File Access (Optional)

To view local `file://` markdown files:

1. Go to extensions page (step 1 above)
2. Find **SkippyMD** in the list
3. Click **Details**
4. Scroll down and enable **Allow access to file URLs**
5. ✅ File access granted!

## Step 3: Test It

### Option A: Open Sample File

1. Click the SkippyMD icon (🥫) in your toolbar
2. Click **Open Viewer**
3. Click the folder icon (📁)
4. Click **Open Folder**
5. Navigate to `/home/sorin/projects/skippy-md/`
6. Select the folder
7. Click `sample.md` in the file tree
8. ✅ See all features in action!

### Option B: Direct File

1. Open file in browser:
   ```
   file:///home/sorin/projects/skippy-md/sample.md
   ```
2. If raw text appears, click **Render with SkippyMD**
3. ✅ Beautiful rendering!

### Option C: Web URL

1. Try a GitHub raw markdown URL:
   ```
   https://raw.githubusercontent.com/github/docs/main/README.md
   ```
2. SkippyMD will detect it and offer to render
3. ✅ Works on web URLs too!

## What to Check

- [ ] Extension icon appears in toolbar
- [ ] Popup opens when clicking icon
- [ ] Viewer opens from popup
- [ ] sample.md renders with:
  - [ ] Table of contents (left sidebar)
  - [ ] Syntax-highlighted code blocks
  - [ ] Math equations ($E=mc^2$)
  - [ ] Mermaid diagrams (flowchart, sequence, etc.)
  - [ ] Emoji :rocket:
  - [ ] Copy buttons on code blocks
  - [ ] Image lightbox (click images)
- [ ] Theme toggle works (🌙 ↔ ☀️)
- [ ] Folder browser works
- [ ] Scroll spy highlights TOC sections

## Troubleshooting

**Extension doesn't load:**
- Make sure Developer Mode is ON
- Check for errors in the extensions page

**File URLs don't work:**
- Enable "Allow access to file URLs" (Step 2)

**Math/diagrams broken:**
- Check browser console (F12) for errors
- Libraries should load from `/lib`

**Folder picker doesn't work:**
- Chrome/Edge only (uses webkitdirectory)
- Firefox not supported for folder picking

## Next Steps

- Read the full `README.md` for features and customization
- Open your own markdown files
- Try the folder browser with your docs
- Toggle theme to match your preference

---

Enjoy beautiful markdown with zero BS! 🥫
