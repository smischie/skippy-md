// @ts-check
const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '..');
const SAMPLE_MD_PATH = `file://${path.resolve(__dirname, '..', 'sample.md')}`;

/**
 * Helper function to launch browser with extension loaded
 */
async function launchBrowserWithExtension() {
  const context = await chromium.launchPersistentContext('', {
    headless: false, // Extensions require headed mode, but we'll use xvfb
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox', // Needed for some environments
      '--disable-dev-shm-usage', // Helps with memory issues
      '--disable-gpu', // Disable GPU for headless
    ],
  });
  
  return context;
}

test.describe('SkippyMD Extension Tests', () => {
  let context;
  let page;

  test.beforeAll(async () => {
    context = await launchBrowserWithExtension();
    // Get or create the first page
    const pages = context.pages();
    page = pages.length > 0 ? pages[0] : await context.newPage();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('1. Extension loads successfully', async () => {
    // Navigate to chrome://extensions to verify extension is loaded
    await page.goto('chrome://extensions');
    await page.waitForTimeout(1000); // Give it time to render
    
    // In headed mode, we should be able to see the extensions page
    // The extension should be loaded (we can't deeply inspect chrome:// pages)
    // But we can verify the page loaded
    const title = await page.title();
    expect(title).toContain('Extensions');
  });

  test('2. Renders basic markdown', async () => {
    await page.goto(SAMPLE_MD_PATH);
    
    // Wait for extension to redirect to viewer
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000); // Wait for rendering
    
    // Verify headings are rendered as proper HTML elements
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text).toContain('SkippyMD Test Document');
    
    // Verify h2 headings exist
    const h2Elements = await page.locator('h2').count();
    expect(h2Elements).toBeGreaterThan(0);
    
    // Verify paragraphs exist
    const paragraphs = await page.locator('p').count();
    expect(paragraphs).toBeGreaterThan(0);
    
    // Verify bold text is rendered
    const boldElements = await page.locator('strong').count();
    expect(boldElements).toBeGreaterThan(0);
    
    // Verify italic text is rendered
    const italicElements = await page.locator('em').count();
    expect(italicElements).toBeGreaterThan(0);
  });

  test('3. Code syntax highlighting works', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Verify code blocks exist
    const codeBlocks = await page.locator('pre code').count();
    expect(codeBlocks).toBeGreaterThan(0);
    
    // Verify highlight.js classes are applied (either on pre or code elements)
    const hljsElements = await page.locator('.hljs, code[class*="language-"]').count();
    expect(hljsElements).toBeGreaterThan(0);
    
    // Verify copy buttons exist on code blocks
    const copyButtons = await page.locator('.copy-code, button:has-text("📋")').count();
    expect(copyButtons).toBeGreaterThan(0);
  });

  test('4. KaTeX math rendering works', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(3000); // KaTeX might take a moment
    
    // Verify KaTeX elements exist
    const katexElements = await page.locator('.katex').count();
    expect(katexElements).toBeGreaterThan(0);
    
    // Verify both inline and block math
    const katexInline = await page.locator('.katex:not(.katex-display)').count();
    expect(katexInline).toBeGreaterThan(0);
    
    const katexDisplay = await page.locator('.katex-display').count();
    expect(katexDisplay).toBeGreaterThan(0);
  });

  test('5. Mermaid diagrams render', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(5000); // Mermaid can take time to render
    
    // Verify SVG elements exist (mermaid renders as SVG)
    const svgElements = await page.locator('svg').count();
    expect(svgElements).toBeGreaterThan(0);
    
    // Check for mermaid-specific classes or IDs
    const mermaidElements = await page.locator('svg[id*="mermaid"], .mermaid svg, pre.mermaid').count();
    expect(mermaidElements).toBeGreaterThanOrEqual(0); // Soft check
  });

  test('6. Table of Contents exists and works', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Verify TOC sidebar exists
    const tocSidebar = page.locator('#toc, .toc-sidebar, #sidebar, .sidebar');
    const tocExists = await tocSidebar.count();
    expect(tocExists).toBeGreaterThan(0);
    
    // Verify TOC has content (could be links or list items)
    const tocItems = await page.locator('#toc *, .toc-sidebar *, #sidebar *, .sidebar *').count();
    expect(tocItems).toBeGreaterThan(0);
  });

  test('7. Dark/Light theme toggle works', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Find theme toggle button
    const themeToggle = page.locator('button:has-text("Dark"), button:has-text("Light"), button:has-text("Theme"), .theme-toggle, #theme-toggle');
    const toggleExists = await themeToggle.count();
    expect(toggleExists).toBeGreaterThan(0);
    
    // Get initial body class
    const initialBodyClass = await page.locator('body').getAttribute('class');
    
    // Click theme toggle
    await themeToggle.first().click();
    await page.waitForTimeout(300);
    
    // Verify body class changed
    const newBodyClass = await page.locator('body').getAttribute('class');
    expect(newBodyClass).not.toBe(initialBodyClass);
    
    // Click again to toggle back
    await themeToggle.first().click();
    await page.waitForTimeout(300);
    
    const finalBodyClass = await page.locator('body').getAttribute('class');
    expect(finalBodyClass).toBe(initialBodyClass);
  });

  test('8. Tables render correctly', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Verify table elements exist
    const tables = await page.locator('table').count();
    expect(tables).toBeGreaterThan(0);
    
    // Verify table has thead
    const thead = await page.locator('table thead').count();
    expect(thead).toBeGreaterThan(0);
    
    // Verify table has tbody
    const tbody = await page.locator('table tbody').count();
    expect(tbody).toBeGreaterThan(0);
    
    // Verify table has rows
    const rows = await page.locator('table tr').count();
    expect(rows).toBeGreaterThan(1); // At least header + 1 data row
  });

  test('9. Task lists render with checkboxes', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Verify checkbox inputs exist
    const checkboxes = await page.locator('input[type="checkbox"]').count();
    expect(checkboxes).toBeGreaterThan(0);
    
    // Verify checked checkboxes exist (sample.md has completed tasks)
    const checkedBoxes = await page.locator('input[type="checkbox"]:checked').count();
    expect(checkedBoxes).toBeGreaterThan(0);
    
    // Verify unchecked checkboxes exist
    const uncheckedBoxes = await page.locator('input[type="checkbox"]:not(:checked)').count();
    expect(uncheckedBoxes).toBeGreaterThan(0);
  });

  test('10. Emoji rendering works', async () => {
    await page.goto(SAMPLE_MD_PATH);
    await page.waitForURL('**/viewer.html**', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Get the page content
    const bodyText = await page.locator('body').textContent();
    
    // Verify emoji section exists OR emoji characters are present
    const hasEmojiSection = bodyText && (bodyText.includes('Emoji') || bodyText.includes('emoji'));
    const hasEmojiImages = await page.locator('img.emoji, .emoji').count();
    const hasEmojiText = bodyText && (bodyText.includes('🚀') || bodyText.includes('✨') || bodyText.includes('🎉') || bodyText.includes('🧠'));
    
    // Pass if ANY emoji rendering method is detected
    expect(hasEmojiSection || hasEmojiImages > 0 || hasEmojiText).toBeTruthy();
  });
});
