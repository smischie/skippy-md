// Content script - detects raw markdown pages and offers to render

function isMarkdownURL() {
    const url = window.location.href;
    return url.endsWith('.md') || url.endsWith('.markdown');
}

function isRawMarkdown() {
    const contentType = document.contentType || '';
    const body = document.body;
    
    // Check if it's plain text
    if (!contentType.includes('text/plain') && !contentType.includes('text/markdown')) {
        return false;
    }
    
    // Check if body only has a <pre> tag (typical for raw markdown)
    if (body.children.length === 1 && body.children[0].tagName === 'PRE') {
        return true;
    }
    
    return false;
}

function createRenderBanner() {
    const banner = document.createElement('div');
    banner.id = 'skippymd-banner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        ">
            <div>
                <strong style="font-size: 16px;">🥫 SkippyMD detected raw Markdown!</strong>
                <span style="margin-left: 15px; opacity: 0.9;">Want to view it with formatting, syntax highlighting, and diagrams?</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="skippymd-render" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                ">Render with SkippyMD</button>
                <button id="skippymd-dismiss" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Dismiss</button>
            </div>
        </div>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Add button handlers
    document.getElementById('skippymd-render').addEventListener('click', () => {
        renderMarkdown();
    });
    
    document.getElementById('skippymd-dismiss').addEventListener('click', () => {
        banner.remove();
    });
}

function renderMarkdown() {
    // Get the raw markdown content
    const pre = document.querySelector('pre');
    const content = pre ? pre.textContent : document.body.textContent;
    
    // Store content in chrome.storage.local instead of sessionStorage
    chrome.storage.local.set({ 'skippymd-content': content }, () => {
        // Redirect to viewer
        const viewerURL = chrome.runtime.getURL('viewer.html') + '?file=' + encodeURIComponent(window.location.href);
        window.location.href = viewerURL;
    });
}

// Check if this page should be rendered
if (isMarkdownURL() && isRawMarkdown()) {
    createRenderBanner();
}

// Also handle direct .md file:// URLs by auto-rendering
if (window.location.protocol === 'file:' && isMarkdownURL()) {
    const pre = document.querySelector('pre');
    if (pre) {
        const content = pre.textContent;
        chrome.storage.local.set({ 'skippymd-content': content }, () => {
            const viewerURL = chrome.runtime.getURL('viewer.html') + '?file=' + encodeURIComponent(window.location.href);
            window.location.href = viewerURL;
        });
    }
}
