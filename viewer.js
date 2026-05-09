// SkippyMD Viewer - Main JavaScript

// Global error handler - catch crashes BEFORE anything else
window.addEventListener('error', function(e) {
    const el = document.getElementById('markdown-content');
    if (el) el.innerHTML = `<pre style="color:red;padding:20px;margin-top:60px">CRASH: ${e.message}\nat ${e.filename}:${e.lineno}:${e.colno}\n${e.error ? e.error.stack : ''}</pre>`;
});

// Initialize Mermaid
mermaid.initialize({ 
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose'
});

// Initialize Markdown-it with all plugins
const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }
        return ''; // Use default escaping
    }
})
.use(window.markdownitFootnote)
.use(window.markdownitTaskLists, { enabled: true })
.use(window.markdownitEmoji);

// KaTeX rendering rule
const mathInline = (tex) => {
    try {
        return katex.renderToString(tex, { throwOnError: false });
    } catch (e) {
        return tex;
    }
};

const mathBlock = (tex) => {
    try {
        return katex.renderToString(tex, { displayMode: true, throwOnError: false });
    } catch (e) {
        return tex;
    }
};

// State
let currentTheme = localStorage.getItem('skippymd-theme') || 'dark';
let currentFolder = null;
let fileList = [];
let currentFileHandle = null;

// Apply theme on load
document.body.className = `${currentTheme}-theme`;
updateThemeElements();

// Get markdown content from URL parameter or storage
async function loadMarkdown() {
    try {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const file = params.get('file');
    
    if (url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            renderMarkdown(text, url);
        } catch (e) {
            document.getElementById('markdown-content').innerHTML = `<p class="error">Failed to load: ${e.message}</p>`;
        }
    } else if (file) {
        // Try to fetch the file directly first (works for file:// with extension permissions)
        try {
            const response = await fetch(decodeURIComponent(file));
            if (response.ok) {
                const text = await response.text();
                renderMarkdown(text, file.split('/').pop());
                return;
            }
        } catch (e) {
            // fetch failed, fall through to storage
        }
        // Fall back to chrome.storage
        chrome.storage.local.get(['skippymd-content'], (result) => {
            const stored = result['skippymd-content'] || sessionStorage.getItem('skippymd-content');
            if (stored) {
                renderMarkdown(stored, file);
                chrome.storage.local.remove(['skippymd-content']);
            } else {
                document.getElementById('markdown-content').innerHTML = '<p class="error">No content found. Please open a markdown file.</p>';
            }
        });
        return;
    } else {
        showWelcome();
    }
    
    // Restore last folder if available
    const lastFolder = localStorage.getItem('skippymd-last-folder');
    if (lastFolder) {
        // Can't auto-restore folder due to security, just show message
        document.getElementById('file-tree').innerHTML = '<p class="hint">Click "Open Folder" to browse markdown files</p>';
    }
    } catch (err) {
        document.getElementById('markdown-content').innerHTML = `<p class="error">Error: ${err.message}<br><pre>${err.stack}</pre></p>`;
    }
}

function showWelcome() {
    const welcome = `# Welcome to SkippyMD! 🥫

A full-featured Markdown viewer with no BS.

## Features

- ✨ **GitHub Flavored Markdown** with tables, strikethrough, task lists
- 🎨 **Syntax Highlighting** for code blocks
- 📐 **Math Equations** using KaTeX ($\\LaTeX$ support)
- 📊 **Mermaid Diagrams** (flowcharts, sequence diagrams, etc.)
- 😊 **Emoji** :rocket: :sparkles: :brain:
- 📁 **Folder Browser** to navigate local markdown files
- 🌓 **Dark/Light Themes**
- 📋 **Copy Code** buttons on all code blocks

## Math Example

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Code Example

\`\`\`javascript
function hello() {
    console.log("Hello from SkippyMD!");
}
\`\`\`

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Open Markdown] --> B{Is it awesome?}
    B -->|Yes| C[Enjoy]
    B -->|No| D[Still enjoy because SkippyMD]
\`\`\`

## Task List

- [x] Build amazing viewer
- [x] Add all features
- [ ] Take over the world

## Get Started

1. Click the 📁 button to open a folder of markdown files
2. Or visit any \`.md\` URL
3. Toggle theme with 🌙 button
4. Navigate with the table of contents

---

*Built with markdown-it, highlight.js, KaTeX, and Mermaid*
`;
    renderMarkdown(welcome, 'Welcome');
}

function renderMarkdown(content, filename) {
    // First, protect code blocks from math processing
    // Extract fenced code blocks and replace with placeholders
    const codeBlocks = [];
    content = content.replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1$/gm, (match) => {
        codeBlocks.push(match);
        return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });
    // Also protect inline code
    content = content.replace(/`[^`]+`/g, (match) => {
        codeBlocks.push(match);
        return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });
    
    // Process math (now safe from code blocks)
    content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
        return '<div class="math-block">' + mathBlock(tex) + '</div>';
    });
    content = content.replace(/(?<!\\)\$([^\$\n]+?)\$/g, (match, tex) => {
        // Skip if it looks like a dollar amount (e.g., $100)
        if (/^\d/.test(tex)) return match;
        return '<span class="math-inline">' + mathInline(tex) + '</span>';
    });
    
    // Restore code blocks
    content = content.replace(/%%CODEBLOCK_(\d+)%%/g, (match, idx) => {
        return codeBlocks[parseInt(idx)];
    });
    
    // Render markdown
    let html = md.render(content);
    
    // Extract and render mermaid diagrams (simplified regex without copy button)
    const mermaidRegex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
    let mermaidIndex = 0;
    html = html.replace(mermaidRegex, (match, code) => {
        // Create a temporary element to decode HTML entities
        const tempEl = document.createElement('div');
        tempEl.innerHTML = code;
        const cleanCode = tempEl.textContent.trim();
        const id = `mermaid-${mermaidIndex++}`;
        return `<div class="mermaid-container"><div id="${id}" class="mermaid">${cleanCode}</div></div>`;
    });
    
    // Render content
    const contentEl = document.getElementById('markdown-content');
    contentEl.innerHTML = html;
    
    // Add copy buttons and hljs classes to code blocks
    contentEl.querySelectorAll('pre code').forEach(codeEl => {
        const preEl = codeEl.parentElement;
        if (!preEl.classList.contains('mermaid-container')) {
            preEl.classList.add('hljs');
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code';
            copyBtn.title = 'Copy code';
            copyBtn.textContent = '📋';
            codeEl.insertBefore(copyBtn, codeEl.firstChild);
        }
    });
    
    // Update filename
    document.getElementById('current-file').textContent = filename || 'Untitled';
    
    // Render mermaid diagrams
    if (mermaidIndex > 0) {
        mermaid.run({
            nodes: document.querySelectorAll('.mermaid')
        });
    }
    
    // Generate TOC
    generateTOC();
    
    // Setup scroll spy
    setupScrollSpy();
    
    // Setup image lightbox
    setupLightbox();
    
    // Setup copy buttons
    setupCopyButtons();
}

function generateTOC() {
    const content = document.getElementById('markdown-content');
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocContent = document.getElementById('toc-content');
    
    if (headings.length === 0) {
        tocContent.innerHTML = '<p class="hint">No headings found</p>';
        return;
    }
    
    let tocHTML = '<ul class="toc-list">';
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName[1]);
        const text = heading.textContent;
        const id = `heading-${index}`;
        heading.id = id;
        
        tocHTML += `<li class="toc-level-${level}"><a href="#${id}" class="toc-link" data-target="${id}">${text}</a></li>`;
    });
    tocHTML += '</ul>';
    
    tocContent.innerHTML = tocHTML;
    
    // Add click handlers
    tocContent.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupScrollSpy() {
    const headings = document.querySelectorAll('#markdown-content h1, #markdown-content h2, #markdown-content h3, #markdown-content h4, #markdown-content h5, #markdown-content h6');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.target === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -66%',
        threshold: 0
    });
    
    headings.forEach(heading => observer.observe(heading));
}

function setupLightbox() {
    const images = document.querySelectorAll('#markdown-content img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.remove('hidden');
        });
    });
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-code').forEach(button => {
        button.addEventListener('click', async () => {
            const code = button.parentElement.textContent.replace('📋', '').trim();
            try {
                await navigator.clipboard.writeText(code);
                button.textContent = '✓';
                setTimeout(() => {
                    button.textContent = '📋';
                }, 2000);
            } catch (e) {
                console.error('Copy failed:', e);
            }
        });
    });
}

function updateThemeElements() {
    const themeToggle = document.getElementById('theme-toggle');
    const highlightTheme = document.getElementById('highlight-theme');
    
    if (currentTheme === 'dark') {
        themeToggle.textContent = '🌙';
        highlightTheme.href = 'lib/highlight-dark.css';
        mermaid.initialize({ theme: 'dark' });
    } else {
        themeToggle.textContent = '☀️';
        highlightTheme.href = 'lib/highlight-light.css';
        mermaid.initialize({ theme: 'default' });
    }
}

// Event Handlers
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = `${currentTheme}-theme`;
    localStorage.setItem('skippymd-theme', currentTheme);
    updateThemeElements();
    
    // Re-render mermaid diagrams with new theme
    const mermaidElements = document.querySelectorAll('.mermaid');
    if (mermaidElements.length > 0) {
        mermaid.run({ nodes: mermaidElements });
    }
});

document.getElementById('toc-toggle')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar-toc');
    sidebar.classList.toggle('collapsed');
    document.getElementById('main-content').classList.toggle('toc-collapsed');
});

document.getElementById('folder-toggle')?.addEventListener('click', () => {
    const filesSidebar = document.getElementById('sidebar-files');
    const mainContent = document.getElementById('main-content');
    
    if (filesSidebar.classList.contains('hidden')) {
        filesSidebar.classList.remove('hidden');
        mainContent.style.marginLeft = filesSidebar.offsetWidth + 'px';
    } else {
        filesSidebar.classList.add('hidden');
        mainContent.style.marginLeft = '0';
    }
});

document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('open-folder-btn')?.addEventListener('click', async () => {
    if (window.showDirectoryPicker) {
        try {
            const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
            const files = await collectMdFiles(dirHandle, dirHandle.name);
            fileList = files;
            renderFileTree(files);
        } catch (e) {
            if (e.name !== 'AbortError') {
                console.error('Folder picker error:', e);
            }
        }
    } else {
        // Fallback to webkitdirectory input
        document.getElementById('folder-picker').click();
    }
});

async function collectMdFiles(dirHandle, basePath) {
    const files = [];
    for await (const entry of dirHandle.values()) {
        const entryPath = basePath + '/' + entry.name;
        if (entry.kind === 'file' && entry.name.endsWith('.md')) {
            const file = await entry.getFile();
            // Attach webkitRelativePath equivalent for tree building
            Object.defineProperty(file, 'webkitRelativePath', { value: entryPath, writable: false });
            files.push(file);
        } else if (entry.kind === 'directory' && !entry.name.startsWith('.')) {
            const subFiles = await collectMdFiles(entry, entryPath);
            files.push(...subFiles);
        }
    }
    return files;
}

document.getElementById('folder-picker')?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files).filter(f => f.name.endsWith('.md'));
    fileList = files;
    renderFileTree(files);
});

document.getElementById('file-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = fileList.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.webkitRelativePath.toLowerCase().includes(query)
    );
    renderFileTree(filtered);
});

function renderFileTree(files) {
    const tree = {};
    
    // Build tree structure properly - skip root folder name
    files.forEach(file => {
        const parts = file.webkitRelativePath.split('/').slice(1); // Skip root folder name
        let current = tree;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                // It's a file - add to _files array
                if (!current._files) current._files = [];
                current._files.push({ name: part, file });
            } else {
                // It's a folder - create nested object
                if (!current[part]) {
                    current[part] = { _count: 0 };
                }
                current = current[part];
            }
        }
    });
    
    // Count files in each folder
    function countFiles(node) {
        let count = 0;
        if (node._files) count += node._files.length;
        Object.keys(node).filter(k => k !== '_files' && k !== '_count').forEach(key => {
            count += countFiles(node[key]);
        });
        if (node._count !== undefined) node._count = count;
        return count;
    }
    countFiles(tree);
    
    // Load expanded state from localStorage
    const expandedState = JSON.parse(localStorage.getItem('skippymd-tree-expanded') || '{}');
    
    const treeHTML = buildTreeHTML(tree, 0, '', expandedState);
    document.getElementById('file-tree').innerHTML = treeHTML || '<p class="hint">No markdown files found</p>';
    
    // Add click handlers for folders (toggle expand/collapse)
    document.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const path = item.dataset.path;
            const content = item.nextElementSibling;
            const arrow = item.querySelector('.folder-arrow');
            
            if (content && content.classList.contains('folder-content')) {
                const isExpanded = !content.classList.contains('collapsed');
                content.classList.toggle('collapsed');
                arrow.textContent = isExpanded ? '▶' : '▼';
                
                // Save state
                expandedState[path] = !isExpanded;
                localStorage.setItem('skippymd-tree-expanded', JSON.stringify(expandedState));
            }
        });
    });
    
    // Add click handlers for files
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // Remove previous active state
            document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
            item.classList.add('active');
            
            const index = parseInt(item.dataset.index);
            const file = fileList[index];
            if (file) {
                const text = await file.text();
                renderMarkdown(text, file.name);
                
                // Keep file browser open, just render the file
            }
        });
    });
}

function buildTreeHTML(node, depth = 0, parentPath = '', expandedState = {}) {
    let html = '';
    
    // Render directories first
    const folders = Object.keys(node).filter(k => k !== '_files' && k !== '_count').sort();
    folders.forEach(key => {
        const path = parentPath ? `${parentPath}/${key}` : key;
        const isExpanded = expandedState[path] || false;
        const arrow = isExpanded ? '▼' : '▶';
        const count = node[key]._count || 0;
        const indent = depth * 20;
        
        html += `<div class="folder-item" data-path="${path}" style="padding-left: ${indent}px">`;
        html += `<span class="folder-arrow">${arrow}</span>`;
        html += `<span class="folder-icon">📁</span>`;
        html += `<span class="folder-name">${key}</span>`;
        html += `<span class="folder-count">(${count})</span>`;
        html += `</div>`;
        
        // Render folder contents (collapsed by default)
        const contentClass = isExpanded ? 'folder-content' : 'folder-content collapsed';
        html += `<div class="${contentClass}">`;
        html += buildTreeHTML(node[key], depth + 1, path, expandedState);
        html += `</div>`;
    });
    
    // Render files at this level
    if (node._files) {
        const files = node._files.sort((a, b) => a.name.localeCompare(b.name));
        files.forEach(({ name, file }) => {
            const index = fileList.indexOf(file);
            const indent = depth * 20;
            html += `<div class="file-item" data-index="${index}" style="padding-left: ${indent}px">`;
            html += `<span class="file-icon">📄</span>`;
            html += `<span class="file-name">${name}</span>`;
            html += `</div>`;
        });
    }
    
    return html;
}

// Show back-to-top button on scroll
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

// Sidebar Resize Functionality
function initSidebarResize() {
    const tocSidebar = document.getElementById('sidebar-toc');
    const filesSidebar = document.getElementById('sidebar-files');
    const mainContent = document.getElementById('main-content');
    
    // Load saved widths
    const savedTocWidth = localStorage.getItem('skippymd-toc-width');
    const savedFilesWidth = localStorage.getItem('skippymd-files-width');
    
    if (savedTocWidth) {
        tocSidebar.style.width = savedTocWidth + 'px';
        document.documentElement.style.setProperty('--sidebar-width', savedTocWidth + 'px');
    }
    if (savedFilesWidth) {
        filesSidebar.style.width = savedFilesWidth + 'px';
    }
    
    // Create resize handles
    const tocHandle = document.createElement('div');
    tocHandle.className = 'resize-handle';
    tocSidebar.appendChild(tocHandle);
    
    const filesHandle = document.createElement('div');
    filesHandle.className = 'resize-handle';
    filesSidebar.appendChild(filesHandle);
    
    // Setup resize handlers
    setupResizeHandle(tocHandle, tocSidebar, 'right', (width) => {
        localStorage.setItem('skippymd-toc-width', width);
        document.documentElement.style.setProperty('--sidebar-width', width + 'px');
        if (!tocSidebar.classList.contains('collapsed')) {
            mainContent.style.marginRight = width + 'px';
        }
    });
    
    setupResizeHandle(filesHandle, filesSidebar, 'left', (width) => {
        localStorage.setItem('skippymd-files-width', width);
        if (!filesSidebar.classList.contains('hidden')) {
            mainContent.style.marginLeft = width + 'px';
        }
    });
}

function setupResizeHandle(handle, sidebar, side, onResize) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = sidebar.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const delta = side === 'left' ? (e.clientX - startX) : (startX - e.clientX);
        const newWidth = Math.max(200, Math.min(600, startWidth + delta));
        sidebar.style.width = newWidth + 'px';
        // Update content margin in real-time
        const mainContent = document.getElementById('main-content');
        if (side === 'left') {
            mainContent.style.marginLeft = newWidth + 'px';
        } else {
            mainContent.style.marginRight = newWidth + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            const finalWidth = sidebar.offsetWidth;
            onResize(finalWidth);
        }
    });
}

// Initialize
try {
    loadMarkdown();
    initSidebarResize();
} catch(e) {
    document.getElementById('markdown-content').innerHTML = `<pre style="color:red;padding:20px">INIT ERROR: ${e.message}\n${e.stack}</pre>`;
}

window.onerror = function(msg, src, line, col, err) {
    const el = document.getElementById('markdown-content');
    if (el) el.innerHTML = `<pre style="color:red;padding:20px">UNCAUGHT: ${msg}\nat ${src}:${line}:${col}\n${err ? err.stack : ''}</pre>`;
};
