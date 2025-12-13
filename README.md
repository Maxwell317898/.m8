# .m8 Format - Compressed HTML Protocol
[**Here is a DEMO that uses .m8 compression**](https://maxwell317898.github.io/.m8/) <br> <br>
**.m8** is a novel HTML compression format that reduces file sizes by replacing verbose HTML tags and attributes with compact numeric codes. Designed as both a transmission protocol and self-extracting file format, .m8 achieves 15-25% compression on typical web pages while maintaining full compatibility with standard HTML.
> [!CAUTION]
>Note that m8 is a Work In Progress, it should not be considered for production use yet
## Story
I have looked up at sysadmins for ages i always wanted to improve on something that effects everything to do with the internet. After a venture into CDN i looked at webpage compression. I soon had an idea for a system that takes strain off servers and onto visitors without making them wait to see a webpage. <br>
As for the name .m8, it mainly came from rage, waiting for things to load.

## How It Works

The .m8 format operates on a simple principle: HTML is inherently repetitive. Tags like `<div>`, `<span>`, and `<header>` appear dozens or hundreds of times in a single document. By mapping these common elements to short numeric codes, .m8 dramatically reduces file size:

- **Tag Compression**: `<div>` → `<1>`, `<span>` → `<2>`, `<header>` → `<18>`
- **Attribute Shorthand**: `class` → `c`, `id` → `i`, `href` → `h`
- **Whitespace Removal**: Non-semantic whitespace between tags is stripped

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
### 1. Self-Contained Files (recomended for general use)

A single HTML file embeds both the decompressor and compressed content. When opened, it automatically decompresses itself. Perfect for offline use, email attachments, or static hosting. Net savings are reduced (~9-12%) due to decompressor overhead, but no server-side processing is required.

**Usage:**
```bash
# Generate a self-extracting .m8 file
node m8-self-contained.js input.html output.html

# Open output.html in any browser - no server needed!
```

### 2. Server-Client Architecture (not recomended general use)

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

### Typical Results (11KB HTML page)

- **Pure compression**: 20.4% smaller
- **Self-contained**: 9.1% net savings (after 1.3KB decompressor overhead)
- **Compression ratio improves with larger files**

### Optimal Use Cases

- Large HTML documents (100KB+) where decompressor overhead is negligible
- Multi-page sites where decompressor can be cached
- Bandwidth-constrained environments
- Combined with gzip/brotli for compound compression (estimated 75-80% total reduction)

### Performance Comparison

| File Size | Pure .m8 Savings | Self-Contained Net |
|-----------|------------------|-------------------|
| 10 KB     | 20%             | 9%                |
| 50 KB     | 20%             | 17%               |
| 100 KB    | 20%             | 19%               |
| 500 KB    | 20%             | 19.7%             |

## Technical Implementation

Built with vanilla JavaScript and Node.js, .m8 requires no dependencies or build tools. The compression algorithm uses regex-based tag and attribute replacement, while the decompressor reverses the process using a simple lookup table. The entire decompressor is under 1.5KB minified.

### Tag Mapping

The format includes mappings for 70 common HTML tags:

```
div → 1       span → 2      p → 3         a → 4
h1 → 6        h2 → 7        h3 → 8        ul → 11
header → 18   footer → 19   nav → 20      section → 21
...and more
```

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
node m8-self-contained.js input.html output.m8.html
```

2. **Open directly:**
- Double-click the file
- Or drag into browser
>[!NOTE]
> If you are using this in production backup your `input.html` to something like `input.source.html` and use the `.m8.html` in your deployment

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

### server.js
Node.js server that:
- Serves minimal HTML client with decompressor
- Compresses .source.html files to .m8 on-the-fly
- Sends compression statistics in response headers

### m8-self-contained.js
Generates single-file HTML that:
- Contains embedded compressed content
- Includes minified decompressor
- Decompresses itself on page load

### m8-converter.js
Core compression/decompression functions:
- `compressToM8(html)` - Compress HTML to .m8
- `decompressFromM8(m8)` - Decompress .m8 to HTML
- `getStats(original, compressed)` - Calculate savings

## Current Limitations

- **~1.3KB decompressor overhead** makes it less effective for very small files
- **Not a replacement for gzip/brotli**, but can be used in combination
- **Requires JavaScript** enabled in browser
- **Best suited for content-heavy pages** rather than minimal landing pages
- **No SEO benefits** - search engines see the loader, not the content (in server-client model)

## Future Potential

The .m8 format demonstrates that domain-specific compression can outperform general-purpose algorithms. Future improvements could include:

- **Common pattern dictionaries**: Compress repeated HTML structures like `<div class="container">` to single tokens
- **Adaptive compression**: Analyze page structure and create custom mappings
- **Framework integration**: Webpack/Vite plugins for automatic .m8 generation
- **Streaming decompression**: Render content progressively as it decompresses
- **Service worker caching**: Cache decompressor permanently for zero overhead

## Browser Compatibility

Works in all modern browsers:
-  Chrome/Edge (Chromium)
-  Firefox
-  Safari
-  Opera
-  Requires JavaScript enabled

## Real-World Applications

**.m8 excels in:**
- Documentation sites with large HTML pages
- Content-heavy web applications
- Bandwidth-limited environments (mobile, satellite)
- Archival/offline HTML distribution
- Educational platforms with rich content

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

## Example Output

```bash
$ node m8-self-contained.js index.source.html index.m8.html

============================================================
Self-Contained .m8 Generator
============================================================
Input:  index.source.html
Output: index.m8.html

✓ Generation complete!

File Sizes:
  Original HTML:      11,631 bytes
  Compressed .m8:     9,257 bytes
  Self-Contained:     10,567 bytes

Savings:
  Pure compression:   20.4%
  Decompressor size:  1,310 bytes
  Net savings:        9.1%
============================================================
```


## Status

**Experimental proof-of-concept** - Created December 2025

---

**Created by**: No Development
