# SkippyMD 🥫

A full-featured, no-BS Markdown viewer for Chrome and Edge. View `.md` files with beautiful formatting, syntax highlighting, math equations, and diagrams — all locally, no accounts, no premium, no telemetry.

## Features

### Core Rendering
- ✨ **GitHub Flavored Markdown** - Tables, strikethrough, task lists, footnotes
- 🎨 **Syntax Highlighting** - 30+ languages via highlight.js
- 📐 **Math Equations** - KaTeX support for inline `$...$` and block `$$...$$` LaTeX
- 📊 **Mermaid Diagrams** - Flowcharts, sequence diagrams, Gantt charts, pie charts, state diagrams
- 😊 **Emoji Support** - `:emoji_name:` converted to Unicode
- 🔗 **Auto-linkify** - Plain URLs automatically become clickable links

### Navigation
- 📑 **Auto-generated Table of Contents** - From document headings
- 🎯 **Scroll Spy** - Highlights current section in TOC as you scroll
- ⬆️ **Back to Top** - Quick navigation button

### File Browser
- 📁 **Folder Browser** - Open a folder and browse all `.md` files
- 🔍 **File Search** - Filter files in the tree
- 💾 **Remember Last Folder** - Picks up where you left off (localStorage)

### Themes
- 🌓 **Dark and Light Themes** - GitHub-inspired styling
- 💾 **Theme Persistence** - Your preference is saved

### UI Polish
- 🖼️ **Image Lightbox** - Click images to view full-size
- 📋 **Copy Code Buttons** - One-click copy on all code blocks
- 📱 **Responsive Layout** - Works on all screen sizes
- 🖨️ **Print-friendly** - Clean printing without sidebar/buttons

## Installation

### Load Unpacked (Developer Mode)

1. **Download/Clone** this repository:
   ```bash
   git clone https://github.com/yourusername/skippy-md.git
   # or download as ZIP and extract
   ```

2. **Open Extension Management**:
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top right

4. **Load Extension**:
   - Click "Load unpacked"
   - Select the `skippy-md` folder

5. **Grant File Access** (for `file://` URLs):
   - Find SkippyMD in your extensions list
   - Click "Details"
   - Enable "Allow access to file URLs"

### Verify Installation

- Click the SkippyMD icon in your toolbar (🥫)
- A popup should appear with extension info
- Click "Open Viewer" to launch the viewer

## Usage

### Viewing Markdown Files

**Option 1: Automatic Detection**
- Open any `.md` file URL (GitHub raw, local `file://`, etc.)
- SkippyMD will detect raw markdown and show a banner
- Click "Render with SkippyMD" to view formatted

**Option 2: Direct Viewer**
- Click the SkippyMD icon → "Open Viewer"
- Use the folder browser (📁 button) to open a folder
- Navigate and click files to view

**Option 3: File Protocol**
- Navigate to a local `.md` file via `file://`
- SkippyMD auto-renders it (if raw text detected)

### Navigation

- **Toggle TOC**: Click ☰ button to show/hide table of contents
- **Toggle Files**: Click 📁 button to show/hide folder browser
- **Toggle Theme**: Click 🌙/☀️ button to switch dark/light
- **Back to Top**: Click ↑ button (appears when scrolling down)
- **Image Lightbox**: Click any image to view full-size

### Folder Browser

1. Click the 📁 button in the header
2. Click "Open Folder" button
3. Select a folder containing `.md` files
4. Files appear in a tree structure
5. Click any file to render it
6. Use search box to filter files

## Testing

Open `sample.md` in the viewer to test all features:

```bash
# If using file:// protocol
file:///path/to/skippy-md/sample.md

# Or use the folder browser
```

The sample file includes:
- All markdown syntax (headings, lists, tables, blockquotes, etc.)
- Code blocks in multiple languages
- Inline and block math equations
- 5 different types of Mermaid diagrams
- Task lists, footnotes, emoji
- Nested structures

## Architecture

### No Build Required

This extension uses **pure vanilla JavaScript** with libraries bundled locally:

- `markdown-it` - Markdown parser
- `highlight.js` - Syntax highlighting
- `katex` - Math rendering
- `mermaid` - Diagram rendering
- `markdown-it` plugins (footnotes, task lists, emoji)

All libraries are downloaded locally in `/lib` — **no CDN dependencies** at runtime.

### File Structure

```
skippy-md/
├── manifest.json           # Extension manifest (v3)
├── viewer.html            # Main viewer page
├── viewer.js              # Viewer logic
├── content.js             # Content script (detects raw .md)
├── popup.html             # Extension popup
├── popup.js               # Popup logic
├── sample.md              # Comprehensive test file
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── lib/                   # Bundled libraries
│   ├── markdown-it.min.js
│   ├── highlight.min.js
│   ├── katex.min.js
│   ├── mermaid.min.js
│   ├── katex.min.css
│   ├── highlight-dark.css
│   ├── highlight-light.css
│   └── (plugins...)
└── styles/
    └── viewer.css         # Main stylesheet
```

### Key Technologies

- **Manifest V3** - Latest Chrome extension standard
- **Content Scripts** - Auto-detect raw markdown pages
- **Web Accessible Resources** - Viewer accessible from content scripts
- **localStorage** - Theme and folder preferences
- **sessionStorage** - Pass markdown content to viewer

## Permissions

SkippyMD requests these permissions:

- `storage` - Save theme preference and last folder
- `webRequest` - Detect `.md` URLs
- `file:///*` - Render local markdown files
- `*://*/*` - Render markdown from any web URL

**Privacy**: All processing happens locally. No telemetry, no tracking, no external requests (except loading the page itself).

## Customization

### Change Theme Colors

Edit `/styles/viewer.css` CSS variables:

```css
:root {
    --bg-primary: #0d1117;      /* Dark background */
    --accent-color: #1f6feb;    /* Accent color */
    /* ... etc ... */
}
```

### Add More Languages to Highlight.js

The current bundle includes 30+ common languages. To add more:

1. Download language-specific highlight.js from [highlightjs.org](https://highlightjs.org/download/)
2. Replace `lib/highlight.min.js`

### Customize Mermaid Theme

Edit `viewer.js` mermaid initialization:

```javascript
mermaid.initialize({ 
    theme: 'dark',  // or 'default', 'forest', 'neutral'
    // ... other options
});
```

## Troubleshooting

### Extension doesn't load

- Make sure Developer Mode is enabled
- Check console for errors: Right-click extension → "Inspect popup"

### File URLs don't work

- Go to `chrome://extensions/` or `edge://extensions/`
- Find SkippyMD → Details → Enable "Allow access to file URLs"

### Math equations don't render

- Check browser console for KaTeX errors
- Ensure syntax is correct: `$inline$` and `$$block$$`
- Equations are processed *before* markdown, so use raw LaTeX

### Mermaid diagrams don't render

- Check browser console for mermaid errors
- Verify diagram syntax at [mermaid.live](https://mermaid.live)
- Try simpler diagram first to isolate syntax issues

### Code highlighting not working

- Verify language name is correct (e.g., \`\`\`javascript not \`\`\`js)
- Check if language is supported by highlight.js
- Console will show warnings for unsupported languages

### Folder browser not working

- Modern browsers restrict file access via `webkitdirectory`
- Make sure you're using Chrome/Edge (not Firefox)
- File access requires user interaction (click button)

## Known Limitations

- **No Firefox support** - Folder picker uses `webkitdirectory` (Chrome/Edge only)
- **File protocol requires permission** - Must manually enable in extension settings
- **No live reload** - Changes to files require manual refresh
- **Session-based folder** - Folder picks aren't persisted (browser security limitation)

## Roadmap

Potential future enhancements:

- [ ] Export to PDF/HTML
- [ ] Custom CSS injection
- [ ] Bookmark/favorite files
- [ ] Recent files list
- [ ] Search within document
- [ ] Collaborative viewing (sync scroll position)
- [ ] Plugin system for custom renderers

## Contributing

This is a free, open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with `sample.md`
5. Submit a pull request

## License

MIT License - feel free to use, modify, and distribute.

## Credits

Built with:
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser
- [highlight.js](https://highlightjs.org/) - Syntax highlighting
- [KaTeX](https://katex.org/) - Math rendering
- [Mermaid](https://mermaid.js.org/) - Diagram rendering

Inspired by: MarkView, Typora, GitHub's markdown rendering

---

**SkippyMD** - Beautiful markdown rendering with zero BS. 🥫
