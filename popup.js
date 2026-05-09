// Popup JavaScript

document.getElementById('open-viewer').addEventListener('click', () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('viewer.html')
    });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = localStorage.getItem('skippymd-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('skippymd-theme', newTheme);
    
    // Show feedback
    const button = document.getElementById('theme-toggle');
    button.textContent = `Theme set to ${newTheme}`;
    setTimeout(() => {
        button.textContent = 'Toggle Theme';
    }, 1500);
});
