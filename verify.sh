#!/bin/bash
# SkippyMD Extension Verification Script

echo "🥫 SkippyMD Extension Verification"
echo "=================================="
echo ""

PROJECT_DIR="/home/sorin/projects/skippy-md"
cd "$PROJECT_DIR"

errors=0
warnings=0

# Check required files
echo "📁 Checking required files..."
required_files=(
    "manifest.json"
    "viewer.html"
    "viewer.js"
    "content.js"
    "popup.html"
    "popup.js"
    "styles/viewer.css"
    "sample.md"
    "README.md"
    "INSTALL.md"
    "icons/icon16.png"
    "icons/icon48.png"
    "icons/icon128.png"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
        ((errors++))
    fi
done

echo ""
echo "📚 Checking libraries..."
required_libs=(
    "lib/markdown-it.min.js"
    "lib/markdown-it-footnote.min.js"
    "lib/markdown-it-task-lists.min.js"
    "lib/markdown-it-emoji.min.js"
    "lib/highlight.min.js"
    "lib/highlight-dark.css"
    "lib/highlight-light.css"
    "lib/katex.min.js"
    "lib/katex.min.css"
    "lib/mermaid.min.js"
)

for lib in "${required_libs[@]}"; do
    if [ -f "$lib" ]; then
        size=$(stat -c%s "$lib" 2>/dev/null || stat -f%z "$lib" 2>/dev/null)
        if [ "$size" -lt 100 ]; then
            echo "  ⚠️  $lib (suspiciously small: ${size} bytes)"
            ((warnings++))
        else
            echo "  ✅ $lib ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo ${size}B))"
        fi
    else
        echo "  ❌ MISSING: $lib"
        ((errors++))
    fi
done

echo ""
echo "🔍 Validating JSON..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "  ✅ manifest.json is valid JSON"
else
    echo "  ❌ manifest.json has JSON errors"
    ((errors++))
fi

echo ""
echo "🔍 Validating JavaScript..."
for jsfile in viewer.js popup.js content.js; do
    if node --check "$jsfile" 2>/dev/null; then
        echo "  ✅ $jsfile syntax OK"
    else
        echo "  ❌ $jsfile has syntax errors"
        ((errors++))
    fi
done

echo ""
echo "📊 Project Statistics"
echo "--------------------"
echo "Total files: $(find . -type f | wc -l)"
echo "Total size: $(du -sh . | cut -f1)"
echo "JavaScript files: $(find . -name "*.js" -not -path "./lib/*" | wc -l)"
echo "Library size: $(du -sh lib 2>/dev/null | cut -f1 || echo 'N/A')"
echo "Code lines (excluding libs): $(find . -name "*.js" -o -name "*.css" -o -name "*.html" | grep -v lib | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')"

echo ""
echo "=================================="
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED!"
    echo "Extension is ready to load!"
elif [ $errors -eq 0 ]; then
    echo "⚠️  $warnings warning(s) found"
    echo "Extension should work but check warnings"
else
    echo "❌ $errors error(s) and $warnings warning(s) found"
    echo "Fix errors before loading extension"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open chrome://extensions/ or edge://extensions/"
echo "2. Enable Developer Mode"
echo "3. Click 'Load unpacked'"
echo "4. Select: $PROJECT_DIR"
echo "5. Test with sample.md"
echo ""
echo "See INSTALL.md for detailed instructions."
