# .m8 Format - Compressed HTML Protocol

[**Here is a DEMO that uses .m8 compression**](https://maxwell317898.github.io/.m8/) <br> <br>
**.m8** is a novel HTML compression format that reduces file sizes by replacing verbose HTML tags and attributes with compact numeric codes. Designed as both a transmission protocol and self-extracting file format, .m8 achieves 14-28% compression on typical web pages while maintaining full compatibility with standard HTML.

> [!CAUTION]
> Note that m8 is a Work In Progress, it should not be considered for production use yet

## Story

I have looked up at sysadmins for ages i always wanted to improve on something that effects everything to do with the internet. After a venture into CDN i looked at webpage compression. I soon had an idea for a system that takes strain off servers and onto visitors without making them wait to see a webpage. <br>
As for the name .m8, it mainly came from rage, waiting for things to load.

## How It Works

The .m8 format operates on a simple principle: HTML is inherently repetitive. Tags like `<div>`, `<span>`, and `<header>` appear dozens or hundreds of times in a single document. By mapping these common elements to short numeric codes, .m8 dramatically reduces file size:

- **Tag Compression**: `<div>` → `<1>`, `<span>` → `<2>`, `<header>` → `<18>`
- **Attribute Shorthand**: `class` → `c`, `id` → `i`, `href` → `h`
- **Whitespace Removal**: Non-semantic whitespace between tags is stripped
- **Dynamic Mapping**: Analyzes your HTML and builds custom tag dictionaries for optimal compression

### Example

```html
<!-- Original HTML (52 bytes) -->
<div class="container">
  <h1>Hello World</h1>
</div>

<!-- .m8 Format (35 bytes, 33% smaller) -->
<1 c="container"><6>Hello World</6></1>
```

## Two Deployment Models

> [!NOTE]
> We would advise that people use the self contained version along with any other compression methods, if you do not want to mess with your hosting configuration.

### 1. Self-Contained Files (recommended for general use)

A single HTML file embeds both the decompressor and compressed content. When opened, it automatically decompresses itself. Perfect for offline use, email attachments, or static hosting. Net savings are reduced (~10-14%) due to decompressor overhead, but no server-side processing is required.

**Usage:**
```bash
# Generate a self-extracting .m8 file with dynamic compression
node m8-dynamic-self-contained.js input.html output.html

# Use output.html like a normal html file
```

### 2. Server-Client Architecture (not recommended for general use. Uses legacy compression)

The client receives a minimal HTML loader (~1KB) containing the decompression script. This loader fetches the .m8 compressed content, decompresses it client-side, and renders the full page. The decompressor is cached by the browser and reused for all subsequent pages, providing pure compression savings (15-25%) on every request.

**Usage:**
```bash
# Start the .m8 server
node server.js

# Create your HTML as .source.html files
# Visit http://localhost:3000/page.html
# Server automatically compresses and serves as .m8
```

## Performance Characteristics

### Real-World Test: GitHub Pages Site (10.4KB HTML)

```
Input:  githubpages.source.html
Output: pagesDYcomp.html

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
  <h3> → <4> (used 18x)
  <section> → <3> (used 8x)
  <h2> → <8> (used 6x)
  <strong> → <5> (used 4x)
  <html> → <12> (used 2x)
  <head> → <13> (used 2x)
  <meta> → <14> (used 2x)
```

### Optimal Use Cases

- Large HTML documents (100KB+) where decompressor overhead is negligible
- Multi-page sites where decompressor can be cached
- Bandwidth-constrained environments
- Combined with gzip/brotli for compound compression (estimated 75-80% total reduction)

### Performance Comparison

| File Size | Pure .m8 Savings | Self-Contained Net |
|-----------|------------------|-------------------|
| 10 KB     | 22-23%          | 10-14%            |
| 50 KB     | 23-25%          | 17-20%            |
| 100 KB    | 25-27%          | 22-25%            |
| 500 KB    | 27-28%          | 26-27%            |

## Dynamic vs Fixed Compression

### Version 2.0: Dynamic Compression (Current)

The new dynamic compressor analyzes your HTML and builds a **custom tag dictionary** based on actual usage:

```javascript
// Analyzes YOUR HTML and finds, for example:
<span> used 50 times  → Gets code <1>
<div> used 48 times   → Gets code <2>
<p> used 20 times     → Gets code <6>
// Rarely-used tags aren't compressed at all!
```

**Benefits:**
- 22-28% compression (vs 15-20% with fixed mapping)
- Adapts to semantic HTML5, custom elements, and your specific tag usage
- Smaller mapping table (only includes tags you actually use)
- Better compression on modern, semantic HTML documents

### Version 1.0: Fixed Dictionary (Legacy)

```javascript
// Same dictionary for every file
'div': '1', 'span': '2', 'p': '3' ...
// ~15-20% compression regardless of content
```

## Technical Implementation

Built with vanilla JavaScript and Node.js, .m8 requires no dependencies or build tools. The dynamic compression algorithm analyzes tag frequency, builds optimal mappings, and uses regex-based replacement. The decompressor reverses the process using the embedded custom lookup table. The entire decompressor is under 1KB minified.

### Dynamic Tag Mapping

Tags are ranked by **savings potential** (frequency × tag length):

```
<span> = 50 × 4 = 200 bytes saved → Gets code <1>
<div>  = 48 × 3 = 144 bytes saved → Gets code <2>
<section> = 8 × 7 = 56 bytes saved → Gets code <3>
```

The compressor automatically selects the top 50 most valuable tags for your specific document.

### Attribute Shorthand

Common attributes are compressed to single characters:

```
class → c         id → i          style → s
src → r           href → h        alt → a
type → y          name → n        value → v
```

## Installation & Setup

### Self-Contained Files

1. **Generate a self-extracting file:**
```bash
node m8-dynamic-self-contained.js input.html output.m8.html
```

2. **Open directly:**
- Double-click the file
- Or drag into browser

> [!NOTE]
> If you are using this in production backup your `input.html` to something like `input.source.html` and use the `.m8.html` in your deployment

### Advanced: Adjust Mapping Table Size

For smaller pages, you can reduce overhead by limiting the mapping table:

```javascript
// Edit m8-dynamic-self-contained.js
// Default: top 50 tags
const tagMap = buildOptimalMapping(frequency, 50);

// Smaller sites: reduce to 30 tags
const tagMap = buildOptimalMapping(frequency, 30);

// Large sites: increase to 70 tags
const tagMap = buildOptimalMapping(frequency, 70);
```

### Server-Client Model

1. **Create your project structure:**
```
m8-server/
├── server.js
├── index.source.html
├── about.source.html
└── contact.source.html
```

2. **Run the server:**
```bash
node server.js
```

3. **Access your pages:**
```
http://localhost:3000/index.html
http://localhost:3000/about.html
```

## File Structure

### m8-dynamic-self-contained.js (v2.0 - Recommended)
Generates single-file HTML with adaptive compression:
- Analyzes tag frequency in your HTML
- Builds optimal custom mapping table
- Contains embedded compressed content
- Includes minified decompressor (~900 bytes)
- Decompresses itself on page load with correct title

### m8-self-contained.js (v1.0 - Legacy)
Fixed dictionary compression:
- Uses predefined tag mappings
- Contains embedded compressed content
- Includes minified decompressor (~1.3KB)
- Decompresses itself on page load

### server.js
Node.js server that:
- Serves minimal HTML client with decompressor
- Compresses .source.html files to .m8 on-the-fly
- Sends compression statistics in response headers

## Current Limitations

- **~900 byte decompressor overhead** makes it less effective for very small files (<5KB)
- **Not a replacement for gzip/brotli**, but can be used in combination
- **Requires JavaScript** enabled in browser
- **Best suited for content-heavy pages** rather than minimal landing pages
- **No SEO benefits** - search engines see the loader, not the content (in server-client model)

## Future Potential

The .m8 format demonstrates that domain-specific compression can outperform general-purpose algorithms. Future improvements could include:

- **Pattern compression**: Compress repeated HTML structures like `<div class="container">` to single tokens
- **Attribute value compression**: Common class names like "container", "wrapper", "btn"
- **Framework integration**: Webpack/Vite plugins for automatic .m8 generation
- **Streaming decompression**: Render content progressively as it decompresses
- **Service worker caching**: Cache decompressor permanently for zero overhead
- **Hybrid mode**: Base dictionary + dynamic extensions for even better compression

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Requires JavaScript enabled

## Real-World Applications

**.m8 excels in:**
- Documentation sites with large HTML pages
- Content-heavy web applications
- Bandwidth-limited environments (mobile, satellite)
- Archival/offline HTML distribution
- Educational platforms with rich content
- Semantic HTML5 heavy sites

**.m8 may not be ideal for:**
- Marketing landing pages (already minimal)
- Single-page applications (JS-heavy, not HTML-heavy)
- Sites requiring immediate SEO indexing
- Very small pages (<5KB)

## Contributing

This is an experimental proof-of-concept. Ideas for improvement:

1. **Enhanced compression algorithms**
2. **Build tool integrations**
3. **Performance benchmarking**
4. **SEO-friendly server rendering**
5. **Progressive decompression**
6. **Automatic optimal mapping size detection**

## Example Output

```bash
$ node m8-dynamic-self-contained.js index.source.html index.m8.html

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
  <h3> → <4> (used 18x)
  <section> → <3> (used 8x)
  <h2> → <8> (used 6x)
  <strong> → <5> (used 4x)
  <html> → <12> (used 2x)
  <head> → <13> (used 2x)
  <meta> → <14> (used 2x)
============================================================
```

## Status

**Experimental proof-of-concept** - Version 2.0 (Dynamic Compression)
- v2.0 - December 2024: Dynamic dictionary building, adaptive compression
- v1.0 - December 2024: Fixed dictionary, initial proof-of-concept

---

**Created by**: Maxwell VDP / No Development
