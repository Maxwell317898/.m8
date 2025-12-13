# .m8 Format - Adaptive HTML Compression

**.m8** is an innovative HTML compression format that achieves 14-28% file size reduction through intelligent tag mapping and dynamic dictionary building. Unlike traditional compression methods, .m8 is specifically designed for HTML documents and adapts to each page's unique structure.

[**Live Demo**](https://maxwell317898.github.io/.m8/) | [GitHub Repository](https://github.com/Maxwell317898/.m8)

## Key Features

- **Adaptive Compression**: Analyzes your HTML and builds custom mappings based on actual tag frequency
- **Self-Contained**: Single-file output with embedded decompressor - no server configuration needed
- **Client-Side Decompression**: Runs in pure JavaScript, compatible with all modern browsers
- **Zero Dependencies**: No build tools, frameworks, or external libraries required
- **Stackable**: Can be combined with gzip/brotli for even greater compression (up to 75-80% total)

## Real-World Performance

### Test Case: GitHub Pages Site (10.4KB HTML)

```
Original HTML:      10,446 bytes
Compressed .m8:      8,052 bytes  (22.9% smaller)
Mapping Table:          82 bytes
Decompressor:          935 bytes
Self-Contained:      8,987 bytes

Net Savings: 14.0% (1,459 bytes saved)
```

**Top Compressed Tags:**
- `<span>` → `<1>` (used 50×)
- `<div>` → `<2>` (used 48×)
- `<p>` → `<6>` (used 20×)
- `<h3>` → `<4>` (used 18×)
- `<section>` → `<3>` (used 8×)

### Performance Characteristics

| File Size | Expected Net Savings | Best Use Case |
|-----------|---------------------|---------------|
| 5-10 KB   | 10-14% | Landing pages, small sites |
| 10-50 KB  | 14-20% | Documentation, blogs |
| 50-100 KB | 20-25% | Rich content pages |
| 100KB+    | 25-28% | Web applications, large documents |

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Maxwell317898/.m8.git
cd .m8

# No dependencies to install!
```

### Basic Usage

```bash
# Compress an HTML file
node m8-dynamic-self-contained.js input.html output.m8.html

# Open the result in any browser
open output.m8.html
```

### Example Output

```
============================================================
Dynamic Self-Contained .m8 Generator
============================================================
Input:  index.source.html
Output: index.m8.html

✓ Generation complete!

File Sizes:
  Original HTML:      10,446 bytes
  Compressed .m8:     8,052 bytes
  Mapping table:      82 bytes
  Self-Contained:     8,987 bytes

Compression Analysis:
  Pure compression:   22.9%
  Decompressor size:  935 bytes
  Net savings:        14.0%

Top 10 Compressed Tags:
  <span> → <1> (used 50x)
  <div> → <2> (used 48x)
  <p> → <6> (used 20x)
  ...
============================================================
```

## How It Works

### 1. Frequency Analysis
The compressor scans your HTML and counts tag occurrences:
```javascript
<span> appears 50 times  → High priority
<div>  appears 48 times  → High priority
<meta> appears 2 times   → Low priority
```

### 2. Optimal Mapping
Tags are ranked by **savings potential** (frequency × tag length):
```
<span> = 50 × 4 = 200 bytes saved → Gets code <1>
<div>  = 48 × 3 = 144 bytes saved → Gets code <2>
<section> = 8 × 7 = 56 bytes saved → Gets code <3>
```

### 3. Compression
Original HTML:
```html
<div class="container">
  <span class="text">Hello World</span>
</div>
```

Compressed .m8:
```html
<2 c="container"><1 c="text">Hello World</1></2>
```

### 4. Self-Extraction
The output file contains:
- **Decompressor** (~900 bytes): JavaScript function to reverse the compression
- **Mapping Table** (~80 bytes): Your custom tag dictionary
- **Compressed Content**: Your HTML with numeric tags

When opened, it automatically decompresses and renders the original HTML.

## Dynamic vs Fixed Compression

### Previous Fixed Method
```javascript
// Same dictionary for every file
'div': '1', 'span': '2', 'p': '3', ...
// ~20% compression regardless of content
```

### New Dynamic Method
```javascript
// Custom dictionary per file
analyzeTagFrequency(html)
buildOptimalMapping()
// 22-28% compression, adapts to your HTML
```

**Why This Matters:**
- Pages heavy on semantic HTML5 (`<article>`, `<section>`, `<figure>`) compress better
- Rarely-used tags aren't wasted in the mapping table
- Each document gets optimal compression for its structure

## Use Cases

### Excellent For
- Documentation sites with large HTML pages
- Content-heavy blogs and articles
- Educational platforms
- Static site generators (Jekyll, Hugo, etc.)
- Offline HTML distribution
- Bandwidth-constrained environments

### Not Ideal For
- Tiny pages (<5KB) - decompressor overhead too large
- JavaScript-heavy SPAs - better to compress JS bundles
- SEO-critical landing pages - search engines see the loader
- Sites requiring instant first paint

## Advanced Configuration

### Adjust Mapping Table Size

Edit `m8-dynamic-self-contained.js`:
```javascript
// Default: top 50 tags
const tagMap = buildOptimalMapping(frequency, 50);

// Smaller sites: reduce to 30 tags for less overhead
const tagMap = buildOptimalMapping(frequency, 30);

// Large sites: increase to 70 tags for better compression
const tagMap = buildOptimalMapping(frequency, 70);
```

### Combine with Traditional Compression

```bash
# Generate .m8 file
node m8-dynamic-self-contained.js input.html output.m8.html

# Apply gzip
gzip output.m8.html

# Result: ~75-80% total compression!
```

## Optimization Tips

1. **Semantic HTML helps**: More `<section>`, `<article>`, `<header>` tags = better compression
2. **Consistent class names**: Attribute shortening (`class` → `c`) works better with uniform naming
3. **Larger files benefit more**: Decompressor overhead becomes negligible above 20KB
4. **Test your pages**: Run the tool to see actual savings before deploying

## 🛠️ Technical Details

### Compression Components

| Component | Size | Purpose |
|-----------|------|---------|
| Decompressor Core | ~700 bytes | Tag/attribute replacement logic |
| Attribute Map | ~150 bytes | `class→c`, `href→h`, etc. |
| Dynamic Tag Table | ~80-200 bytes | Custom per-file mappings |
| HTML Wrapper | ~100 bytes | `<html>`, `<script>` structure |
| **Total Overhead** | **~900-1100 bytes** | One-time cost per file |

### Browser Compatibility
-  Chrome/Edge 90+
-  Firefox 88+
-  Safari 14+
-  Opera 76+
-  Requires JavaScript enabled

### Performance Metrics
- **Decompression time**: <10ms for 100KB HTML
- **Memory overhead**: Minimal (~2× compressed size during decompression)
- **First paint delay**: Negligible (<50ms)

## Known Limitations

- **~900 byte overhead** makes it less effective for very small files
- **No SEO benefits** - search engines see the loader HTML (self-contained version)
- **JavaScript required** - won't work with JS disabled
- **Title flickering**: Brief "Loading..." before actual title appears (now fixed!)

## Contributing

Ideas for improvement:
1. Enhanced compression algorithms
2. Framework integrations (Next.js, Nuxt, etc.)
3. Performance benchmarking tools
4. SEO-friendly server rendering mode
5. Automatic optimal mapping size detection


## Project Goals

.m8 was created to demonstrate that **domain-specific compression** can outperform general-purpose algorithms by understanding the structure of HTML. The goal isn't to replace gzip/brotli, but to provide an additional layer of compression that:

- Works entirely client-side
- Requires zero server configuration
- Adapts to each document's unique structure
- Maintains 100% HTML compatibility


**Created by**: Maxwell / No Development  
**Status**: Experimental (v2.0 - Dynamic Compression)  