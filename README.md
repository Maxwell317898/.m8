# .m8 Format - Compressed HTML Protocol

[**Here is a DEMO that uses .m8 compression**](https://maxwell317898.github.io/.m8/) <br>

**.m8** is a dynamic html compression algorithem that can reduce the size of large web pages by 20%. Additionaly you can use other web compression tools to this like gzip, this works because the .m8 (self contained) loader is recognised as normal html.

> [!CAUTION]
> Note that m8 is a Work In Progress, it should not be considered for production use yet.
> M8 is stable enough to use in testing projects etc.

>[!NOTE]
> NodeJs Server implimentation has been removed.

## How It Works

The .m8 format operates on a simple principle: HTML is inherently repetitive. Tags like `<div>`, `<span>`, and `<header>` appear dozens or hundreds of times in a single document. By mapping these common elements to short numeric codes, .m8 reduces file size:

- **Tag Compression**: `<div>` → `<1>`, `<span>` → `<2>`, `<header>` → `<18>`
- **Attribute Shorthand**: `class` → `c`, `id` → `i`, `href` → `h`
- **Whitespace Removal**: Non-semantic whitespace between tags is stripped
- **Dynamic Mapping**: Analyzes the provided HTML file and builds custom tag dictionaries for optimal compression

### Example

```html
<!-- Original HTML (52 bytes) -->
<div class="container">
  <h1>Hello World</h1>
</div>
```
```html
<!-- .m8 Format (35 bytes, 33% smaller) -->
<1 c="container"><6>Hello World</6></1>
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
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera
- *Requires JavaScript to be enabled*

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


**Created by**: Maxwell VDP / No Development
