// SkippyMD Viewer - Main JavaScript

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
                const highlighted = hljs.highlight(str, { language: lang }).value;
                return `<pre class="hljs"><code class="language-${lang}"><button class="copy-code" title="Copy code">📋</button>${highlighted}</code></pre>`;
            } catch (__) {}
        }
        return `<pre class="hljs"><code><button class="copy-code" title="Copy code">📋</button>${md.utils.escapeHtml(str)}</code></pre>`;
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
        // Try to load from storage
        const stored = sessionStorage.getItem('skippymd-content');
        if (stored) {
            renderMarkdown(stored, file);
        }
    } else {
        showWelcome();
    }
    
    // Restore last folder if available
    const lastFolder = localStorage.getItem('skippymd-last-folder');
    if (lastFolder) {
        // Can't auto-restore folder due to security, just show message
        document.getElementById('file-tree').innerHTML = '<p class="hint">Click "Open Folder" to browse markdown files</p>';
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
    // Process math first (before markdown-it)
    content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
        return '<div class="math-block">' + mathBlock(tex) + '</div>';
    });
    content = content.replace(/\$(.+?)\$/g, (match, tex) => {
        return '<span class="math-inline">' + mathInline(tex) + '</span>';
    });
    
    // Render markdown
    let html = md.render(content);
    
    // Extract and render mermaid diagrams
    const mermaidRegex = /<pre><code class="language-mermaid">[\s\S]*?<button class="copy-code"[^>]*>📋<\/button>([\s\S]*?)<\/code><\/pre>/g;
    let mermaidIndex = 0;
    html = html.replace(mermaidRegex, (match, code) => {
        const cleanCode = code.replace(/<[^>]+>/g, '').trim();
        const id = `mermaid-${mermaidIndex++}`;
        return `<div class="mermaid-container"><div id="${id}" class="mermaid">${cleanCode}</div></div>`;
    });
    
    // Render content
    const contentEl = document.getElementById('markdown-content');
    contentEl.innerHTML = html;
    
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
document.getElementById('theme-toggle').addEventListener('click', () => {
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

document.getElementById('toc-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar-toc');
    sidebar.classList.toggle('collapsed');
    document.getElementById('main-content').classList.toggle('sidebar-collapsed');
});

document.getElementById('folder-toggle').addEventListener('click', () => {
    const tocSidebar = document.getElementById('sidebar-toc');
    const filesSidebar = document.getElementById('sidebar-files');
    
    if (filesSidebar.classList.contains('hidden')) {
        filesSidebar.classList.remove('hidden');
        tocSidebar.classList.add('hidden');
    } else {
        filesSidebar.classList.add('hidden');
        tocSidebar.classList.remove('hidden');
    }
});

document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('open-folder-btn').addEventListener('click', () => {
    document.getElementById('folder-picker').click();
});

document.getElementById('folder-picker').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files).filter(f => f.name.endsWith('.md'));
    fileList = files;
    renderFileTree(files);
});

document.getElementById('file-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = fileList.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.webkitRelativePath.toLowerCase().includes(query)
    );
    renderFileTree(filtered);
});

function renderFileTree(files) {
    const tree = {};
    
    files.forEach(file => {
        const parts = file.webkitRelativePath.split('/');
        let current = tree;
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                if (!current._files) current._files = [];
                current._files.push({ name: part, file });
            } else {
                if (!current[part]) current[part] = {};
                current = current[part];
            }
        }
    });
    
    const treeHTML = buildTreeHTML(tree);
    document.getElementById('file-tree').innerHTML = treeHTML || '<p class="hint">No markdown files found</p>';
    
    // Add click handlers
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const index = parseInt(item.dataset.index);
            const file = fileList[index];
            if (file) {
                const text = await file.text();
                renderMarkdown(text, file.name);
                
                // Switch back to TOC sidebar
                document.getElementById('sidebar-files').classList.add('hidden');
                document.getElementById('sidebar-toc').classList.remove('hidden');
            }
        });
    });
}

function buildTreeHTML(node, depth = 0) {
    let html = '';
    
    // Render directories
    Object.keys(node).filter(k => k !== '_files').forEach(key => {
        html += `<div class="folder-item" style="padding-left: ${depth * 20}px">📁 ${key}</div>`;
        html += buildTreeHTML(node[key], depth + 1);
    });
    
    // Render files
    if (node._files) {
        node._files.forEach(({ name, file }) => {
            const index = fileList.indexOf(file);
            html += `<div class="file-item" data-index="${index}" style="padding-left: ${depth * 20}px">📄 ${name}</div>`;
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

// Initialize
loadMarkdown();
