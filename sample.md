# SkippyMD Test Document 🥫

Welcome to the **SkippyMD** comprehensive test document! This file exercises all features.

## Table of Contents

This document will automatically generate a table of contents in the sidebar.

## Text Formatting

This is regular text. You can use **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

> This is a blockquote.
> It can span multiple lines.
> 
> Even multiple paragraphs!

### Lists

Unordered list:
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item
   1. Nested 3.1
   2. Nested 3.2

### Task Lists

- [x] Feature 1: Markdown rendering
- [x] Feature 2: Syntax highlighting
- [x] Feature 3: Math equations
- [x] Feature 4: Mermaid diagrams
- [ ] Feature 5: World domination

## Links and Images

[Visit GitHub](https://github.com)

Auto-linked URL: https://example.com

![Sample Image](https://via.placeholder.com/600x200/667eea/ffffff?text=SkippyMD+Sample+Image)

## Code Blocks

### JavaScript

```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55
```

### Python

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

### Bash

```bash
#!/bin/bash
for i in {1..5}; do
    echo "Iteration $i"
done
```

### JSON

```json
{
  "name": "SkippyMD",
  "version": "1.0.0",
  "features": ["markdown", "math", "diagrams"],
  "awesome": true
}
```

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown rendering | ✅ Done | High |
| Syntax highlighting | ✅ Done | High |
| Math equations | ✅ Done | Medium |
| Mermaid diagrams | ✅ Done | Medium |
| Dark/Light theme | ✅ Done | Low |

## Math Equations

### Inline Math

The famous equation: $E = mc^2$

Pythagorean theorem: $a^2 + b^2 = c^2$

### Block Math

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Euler's identity:

$$
e^{i\pi} + 1 = 0
$$

The sum of a geometric series:

$$
S = \sum_{n=0}^{\infty} ar^n = \frac{a}{1-r} \quad \text{for } |r| < 1
$$

Matrix multiplication:

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\;
\begin{bmatrix}
x \\
y
\end{bmatrix}
\;=\;
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

## Mermaid Diagrams

### Flowchart

```mermaid
graph TD
    A[Start] --> B{Is Markdown?}
    B -->|Yes| C[Render with SkippyMD]
    B -->|No| D[Use another viewer]
    C --> E[Enjoy beautiful rendering]
    D --> F[Cry a little]
    E --> G[Share with friends]
    F --> G
    G --> H[End]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SkippyMD
    participant Markdown
    
    User->>Browser: Open .md file
    Browser->>SkippyMD: Detect markdown
    SkippyMD->>Markdown: Parse content
    Markdown-->>SkippyMD: HTML output
    SkippyMD->>SkippyMD: Apply syntax highlighting
    SkippyMD->>SkippyMD: Render math equations
    SkippyMD->>SkippyMD: Generate diagrams
    SkippyMD-->>Browser: Beautiful output
    Browser-->>User: Display rendered page
```

### Gantt Chart

```mermaid
gantt
    title SkippyMD Development Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Planning           :a1, 2024-01-01, 7d
    Design             :a2, after a1, 5d
    section Phase 2
    Core Development   :a3, after a2, 14d
    Testing            :a4, after a3, 7d
    section Phase 3
    Polish             :a5, after a4, 5d
    Release            :milestone, after a5, 0d
```

### Pie Chart

```mermaid
pie title Time Spent on Features
    "Markdown Parsing" : 25
    "Syntax Highlighting" : 20
    "Math Rendering" : 15
    "Mermaid Integration" : 20
    "UI/UX Design" : 15
    "Testing" : 5
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: Open file
    Loading --> Parsing: Content loaded
    Parsing --> Rendering: Parsed successfully
    Parsing --> Error: Parse failed
    Rendering --> Display: Render complete
    Error --> Idle: Reset
    Display --> Idle: Close file
    Display --> [*]
```

## Emoji Support

Emojis work great! :rocket: :sparkles: :brain: :books: :computer:

:tada: :fire: :zap: :star: :heart: :thumbsup: :100:

## Horizontal Rule

---

## Footnotes

Here's a sentence with a footnote[^1].

And another with a second footnote[^2].

[^1]: This is the first footnote. It contains additional information.

[^2]: This is the second footnote. Footnotes are automatically numbered and linked.

## Nested Structures

### Complex List with Code

1. **First major point**
   
   Some explanation here.
   
   ```python
   def example():
       return "nested code"
   ```
   
   - Sub-point A
   - Sub-point B with inline math: $\alpha = \beta + \gamma$

2. **Second major point**
   
   > A nested blockquote
   > with multiple lines
   
   | Nested | Table |
   |--------|-------|
   | Cell 1 | Cell 2 |

## Long Content for Scroll Testing

### Section 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Section 2

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 3

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Section 4

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Section 5

The scroll spy feature should highlight the current section in the table of contents as you scroll through this document.

## Conclusion

**SkippyMD** demonstrates all features:

✅ GitHub Flavored Markdown  
✅ Syntax highlighting (30+ languages)  
✅ Math equations (KaTeX)  
✅ Mermaid diagrams (flowchart, sequence, gantt, pie, state)  
✅ Emoji support  
✅ Table of contents with scroll spy  
✅ Folder browser  
✅ Dark/Light themes  
✅ Image lightbox  
✅ Copy code buttons  
✅ Responsive design  
✅ Print-friendly styles  

---

*Created with ❤️ and zero BS*
