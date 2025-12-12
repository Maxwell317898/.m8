// Self-Contained .m8 Generator
// Creates a single HTML file with embedded decompressor and compressed content
// Usage: node m8-self-contained.js input.html output.html

const fs = require('fs');
const path = require('path');

// Tag mapping
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

// Escape HTML for embedding in script
function escapeForScript(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Generate self-contained .m8 HTML file
function generateSelfContained(originalHtml) {
  const compressed = compressToM8(originalHtml);
  const escaped = escapeForScript(compressed);
  
  const originalSize = Buffer.byteLength(originalHtml);
  const compressedSize = Buffer.byteLength(compressed);
  const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  // Self-extracting HTML template
  const selfExtractingHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Loading...</title></head><body>
<script>
(function(){
const m8='${escaped}';
const t={'1':'div','2':'span','3':'p','4':'a','5':'img','6':'h1','7':'h2','8':'h3','9':'h4','10':'h5','11':'ul','12':'ol','13':'li','14':'table','15':'tr','16':'td','17':'th','18':'header','19':'footer','20':'nav','21':'section','22':'article','23':'aside','24':'main','25':'form','26':'input','27':'button','28':'textarea','29':'select','30':'option','31':'label','32':'script','33':'style','34':'link','35':'meta','36':'html','37':'head','38':'body','39':'title','40':'br','41':'hr','42':'strong','43':'em','44':'b','45':'i','46':'u','47':'small','48':'mark','49':'del','50':'ins'};
const a={'c':'class','i':'id','s':'style','r':'src','h':'href','a':'alt','t':'title','y':'type','n':'name','v':'value','p':'placeholder'};
function d(m){
let h=m.replace(/<(\\w+)([^>]*)>/g,function(match,tag,attrs){
const lt=t[tag]||tag;
let la=attrs;
for(const s in a){
const l=a[s];
const r=new RegExp('\\\\s'+s+'=','g');
la=la.replace(r,' '+l+'=');
}
return '<'+lt+la+'>';
});
h=h.replace(/<\\/(\\w+)>/g,function(match,tag){
const lt=t[tag]||tag;
return '</'+lt+'>';
});
return h;
}
const html=d(m8);
document.open();
document.write(html);
document.close();
})();
</script>
</body></html>`;

  return {
    html: selfExtractingHtml,
    stats: {
      originalSize,
      compressedSize,
      selfContainedSize: Buffer.byteLength(selfExtractingHtml),
      savings
    }
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node m8-self-contained.js <input.html> <output.html>');
    console.log('');
    console.log('Example:');
    console.log('  node m8-self-contained.js index.source.html index.m8.html');
    console.log('');
    console.log('This creates a self-extracting HTML file that decompresses itself on load!');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found`);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Self-Contained .m8 Generator');
  console.log('='.repeat(60));
  console.log(`Input:  ${inputFile}`);
  console.log(`Output: ${outputFile}`);
  console.log('');

  const originalHtml = fs.readFileSync(inputFile, 'utf8');
  const result = generateSelfContained(originalHtml);

  fs.writeFileSync(outputFile, result.html, 'utf8');

  console.log('✓ Generation complete!');
  console.log('');
  console.log('File Sizes:');
  console.log(`  Original HTML:      ${result.stats.originalSize.toLocaleString()} bytes`);
  console.log(`  Compressed .m8:     ${result.stats.compressedSize.toLocaleString()} bytes`);
  console.log(`  Self-Contained:     ${result.stats.selfContainedSize.toLocaleString()} bytes`);
  console.log('');
  console.log('Savings:');
  console.log(`  Pure compression:   ${result.stats.savings}%`);
  const overhead = result.stats.selfContainedSize - result.stats.compressedSize;
  const netSavings = ((result.stats.originalSize - result.stats.selfContainedSize) / result.stats.originalSize * 100).toFixed(1);
  console.log(`  Decompressor size:  ${overhead.toLocaleString()} bytes`);
  console.log(`  Net savings:        ${netSavings}%`);
  console.log('');
  console.log('Now open the file in a browser:');
  console.log(`  file://${path.resolve(outputFile)}`);
  console.log('  or');
  console.log(`  open ${outputFile}`);
  console.log('='.repeat(60) + '\n');
}

// Export for use as module
module.exports = {
  compressToM8,
  generateSelfContained
};
