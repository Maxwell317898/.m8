// .m8 Server - Serves compressed .m8 files
// Usage: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Tag mapping (same as converter)
const tagMap = {
  'div': '1', 'span': '2', 'p': '3', 'a': '4', 'img': '5',
  'h1': '6', 'h2': '7', 'h3': '8', 'h4': '9', 'h5': '10',
  'ul': '11', 'ol': '12', 'li': '13', 'table': '14', 'tr': '15',
  'td': '16', 'th': '17', 'header': '18', 'footer': '19', 'nav': '20',
  'section': '21', 'article': '22', 'aside': '23', 'main': '24', 'form': '25',
  'input': '26', 'button': '27', 'textarea': '28', 'select': '29', 'option': '30',
  'label': '31', 'script': '32', 'style': '33', 'link': '34', 'meta': '35',
  'html': '36', 'head': '37', 'body': '38', 'title': '39', 'br': '40',
  'hr': '41', 'strong': '42', 'em': '43', 'b': '44', 'i': '45',
  'u': '46', 'small': '47', 'mark': '48', 'del': '49', 'ins': '50'
};

const attrMap = {
  'class': 'c', 'id': 'i', 'style': 's', 'src': 'r',
  'href': 'h', 'alt': 'a', 'title': 't', 'type': 'y',
  'name': 'n', 'value': 'v', 'placeholder': 'p'
};

// Compress HTML to .m8
function compressToM8(html) {
  let compressed = html.replace(/>\s+</g, '><');
  
  compressed = compressed.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
    const shortTag = tagMap[tag.toLowerCase()] || tag;
    let shortAttrs = attrs;
    for (const [long, short] of Object.entries(attrMap)) {
      const regex = new RegExp(`\\s${long}=`, 'g');
      shortAttrs = shortAttrs.replace(regex, ` ${short}=`);
    }
    return `<${shortTag}${shortAttrs}>`;
  });

  compressed = compressed.replace(/<\/(\w+)>/g, (match, tag) => {
    const shortTag = tagMap[tag.toLowerCase()] || tag;
    return `</${shortTag}>`;
  });

  return compressed;
}

// Minimal client HTML that decompresses .m8
const CLIENT_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loading .m8...</title>
</head>
<body>
<div style="text-align:center;padding:50px;font-family:sans-serif;">
<h2>Loading .m8 content...</h2>
<p style="color:#666;">Decompressing page...</p>
</div>
<script>
(function(){
if(window.m8Loaded)return;
window.m8Loaded=true;
const tagMap={'1':'div','2':'span','3':'p','4':'a','5':'img','6':'h1','7':'h2','8':'h3','9':'h4','10':'h5','11':'ul','12':'ol','13':'li','14':'table','15':'tr','16':'td','17':'th','18':'header','19':'footer','20':'nav','21':'section','22':'article','23':'aside','24':'main','25':'form','26':'input','27':'button','28':'textarea','29':'select','30':'option','31':'label','32':'script','33':'style','34':'link','35':'meta','36':'html','37':'head','38':'body','39':'title','40':'br','41':'hr','42':'strong','43':'em','44':'b','45':'i','46':'u','47':'small','48':'mark','49':'del','50':'ins'};
const attrMap={'c':'class','i':'id','s':'style','r':'src','h':'href','a':'alt','t':'title','y':'type','n':'name','v':'value','p':'placeholder'};
function decompress(m){
let h=m;
h=h.replace(/<(\\w+)([^>]*)>/g,function(match,tag,attrs){
const longTag=tagMap[tag]||tag;
let longAttrs=attrs;
for(const short in attrMap){
const long=attrMap[short];
const regex=new RegExp('\\\\s'+short+'=','g');
longAttrs=longAttrs.replace(regex,' '+long+'=');
}
return '<'+longTag+longAttrs+'>';
});
h=h.replace(/<\\/(\\w+)>/g,function(match,tag){
const longTag=tagMap[tag]||tag;
return '</'+longTag+'>';
});
return h;
}
const m8Path=window.location.pathname.replace('.html','.m8');
fetch(m8Path)
.then(function(r){return r.text();})
.then(function(m8){
const html=decompress(m8);
document.open();
document.write(html);
document.close();
})
.catch(function(e){
document.body.innerHTML='<div style="text-align:center;padding:50px;font-family:sans-serif;"><h1 style="color:#e53e3e;">Error Loading .m8</h1><p>'+e.message+'</p><p style="color:#666;margin-top:20px;">Make sure the .source.html file exists</p></div>';
});
})();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${timestamp} - ${req.method} ${req.url}`);

  // Remove query string and decode URL
  let urlPath = req.url.split('?')[0];
  urlPath = decodeURIComponent(urlPath);
  console.log(`  Parsed path: ${urlPath}`);

  // Handle root
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  // Determine file extension
  const ext = path.extname(urlPath).toLowerCase();

  // If requesting .html file, serve the minimal client
  if (ext === '.html') {
    console.log(`  → Serving minimal .m8 client`);
    res.writeHead(200, { 
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(CLIENT_HTML)
    });
    res.end(CLIENT_HTML);
    return;
  }

  // If requesting .m8 file, compress and serve
  if (ext === '.m8') {
    console.log(`  → .m8 file requested`);
    const filePath = path.join(__dirname, urlPath);
    console.log(`  Looking for: ${filePath}`);
    
    // Check if .m8 file exists
    if (fs.existsSync(filePath)) {
      console.log(`  → Found existing .m8 file`);
      // Serve existing .m8 file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.log(`  ✗ Error reading .m8 file:`, err.message);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error reading .m8 file');
          return;
        }
        res.writeHead(200, { 
          'Content-Type': 'text/plain',
          'X-Content-Format': 'm8'
        });
        res.end(data);
      });
    } else {
      console.log(`  → .m8 file not found, looking for source HTML`);
      // Try to find corresponding HTML file and convert it
      const htmlPath = filePath.replace('.m8', '.source.html');
      console.log(`  Looking for source: ${htmlPath}`);
      
      if (fs.existsSync(htmlPath)) {
        console.log(`  ✓ Found source HTML, compressing...`);
        fs.readFile(htmlPath, 'utf8', (err, html) => {
          if (err) {
            console.log(`  ✗ Error reading source HTML:`, err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading source HTML');
            return;
          }
          
          const m8 = compressToM8(html);
          const originalSize = Buffer.byteLength(html);
          const m8Size = Buffer.byteLength(m8);
          const savings = ((originalSize - m8Size) / originalSize * 100).toFixed(1);
          
          console.log(`  ✓ Compressed: ${originalSize}B → ${m8Size}B (${savings}% saved)`);
          
          res.writeHead(200, { 
            'Content-Type': 'text/plain',
            'X-Content-Format': 'm8',
            'X-Original-Size': originalSize,
            'X-Compressed-Size': m8Size,
            'X-Savings': savings + '%'
          });
          res.end(m8);
        });
      } else {
        console.log(`  ✗ Source HTML not found!`);
        console.log(`  Expected location: ${htmlPath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - .m8 or source HTML file not found\n\nExpected: ' + htmlPath);
      }
    }
    return;
  }

  // Serve other static files (CSS, JS, images, etc.)
  const filePath = path.join(__dirname, urlPath);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - File not found');
    return;
  }

  const mimeTypes = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('.m8 Server Running!');
  console.log('='.repeat(50));
  console.log(`Server: http://localhost:${PORT}`);
  console.log('');
  console.log('How it works:');
  console.log('1. Create "page.source.html" with your HTML');
  console.log('2. Visit http://localhost:3000/page.html');
  console.log('3. Server compresses to .m8 and sends minimal client');
  console.log('4. Client decompresses and displays the page');
  console.log('');
  console.log('Example files to create:');
  console.log('  - index.source.html (your actual HTML)');
  console.log('  - about.source.html');
  console.log('  - contact.source.html');
  console.log('='.repeat(50));
});
