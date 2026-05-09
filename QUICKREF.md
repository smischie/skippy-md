# SkippyMD Quick Reference

## 🎯 One-Liner

**Full-featured Markdown viewer extension for Chrome/Edge with syntax highlighting, math equations, and diagrams. Zero accounts, zero BS.**

## 🚀 Load Extension (30 seconds)

```
1. chrome://extensions/ or edge://extensions/
2. Enable "Developer mode" (top right)
3. "Load unpacked" → select /home/sorin/projects/skippy-md/
4. Done!
```

## 🎨 Features at a Glance

| Feature | Status | Usage |
|---------|--------|-------|
| GFM Markdown | ✅ | Tables, strikethrough, task lists, footnotes |
| Syntax Highlighting | ✅ | 30+ languages, copy-code buttons |
| Math Equations | ✅ | KaTeX: `$inline$` and `$$block$$` |
| Mermaid Diagrams | ✅ | Flowcharts, sequence, gantt, pie, state |
| Emoji | ✅ | `:rocket:` → 🚀 |
| TOC | ✅ | Auto-generated with scroll spy |
| Folder Browser | ✅ | Open folder, navigate .md files |
| Themes | ✅ | Dark/Light with persistence |
| Image Lightbox | ✅ | Click images to enlarge |
| Responsive | ✅ | Works on all screen sizes |

## ⌨️ Keyboard Shortcuts

| Button | Action |
|--------|--------|
| ☰ | Toggle Table of Contents |
| 📁 | Toggle Folder Browser |
| 🌙 / ☀️ | Toggle Dark/Light Theme |
| ↑ | Back to Top |

## 📂 How to View Markdown

### Method 1: Auto-Detect
1. Open any `.md` URL (web or file://)
2. Banner appears: "Render with SkippyMD"
3. Click → Beautiful rendering

### Method 2: Folder Browser
1. Click SkippyMD icon (🥫)
2. "Open Viewer"
3. Click 📁 → "Open Folder"
4. Select folder with .md files
5. Click any file to render

### Method 3: Direct
1. Visit `file:///path/to/file.md`
2. Auto-renders if raw text detected

## 🧪 Test It

```bash
# Load extension, then:
file:///home/sorin/projects/skippy-md/sample.md
```

✅ Verify: Syntax highlighting, math, 5 diagram types, emoji, TOC, theme toggle

## 🛠️ Customization

**Change theme colors:**  
Edit `styles/viewer.css` → `:root` CSS variables

**Add languages:**  
Replace `lib/highlight.min.js` with custom bundle from highlightjs.org

**Mermaid theme:**  
Edit `viewer.js` → `mermaid.initialize({ theme: 'dark' })`

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension won't load | Enable Developer Mode |
| File URLs don't work | Extensions → SkippyMD → Details → "Allow access to file URLs" |
| Math broken | Check console (F12), verify `$...$` or `$$...$$` syntax |
| Diagrams broken | Check syntax at mermaid.live |
| Folder picker not working | Chrome/Edge only (webkitdirectory) |

## 📁 Project Structure

```
skippy-md/
├── manifest.json          # Extension config
├── viewer.html/js         # Main viewer (400+ lines)
├── content.js             # Auto-detect raw .md
├── popup.html/js          # Extension popup
├── sample.md              # Test all features
├── lib/                   # All dependencies (3.4 MB)
└── styles/viewer.css      # GitHub-inspired theme
```

## 📚 Documentation

- **README.md** - Full docs (architecture, features, customization)
- **INSTALL.md** - Step-by-step installation
- **PROJECT_SUMMARY.md** - Development summary
- **verify.sh** - Validation script

## 🎉 Key Stats

- **1238 lines** of code (excluding libraries)
- **3.5 MB** total size (3.4 MB libraries)
- **26 files** total
- **Zero build step** - pure vanilla JS
- **Zero runtime CDN** - everything bundled

## 🔒 Privacy

- ✅ All processing local
- ✅ No telemetry
- ✅ No accounts
- ✅ No external requests (except loading the page)
- ✅ Open source (MIT)

---

**Ready to load!** See INSTALL.md for detailed walkthrough.
