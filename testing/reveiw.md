# Dynamic compression results
m8 dynamic compression tested on github pages (index.source.html)

## Results
m8 can now be succesful in compressing small files with at least 10% (more testing needed).
on smaller pages the mapping table can be adjusted to allow for a smaller mapping table while retaining usefullness

output (V2 Dy-Comp / fixed "loading..." title added like 60 bytes...):
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

output (V1 Dy-Comp / Broken "loading..." title on web content):
```
Input:  githubpages.source.html
Output: pagesDYcomp.html

✓ Generation complete!

File Sizes:
  Original HTML:      10,446 bytes
  Compressed .m8:     8,052 bytes
  Mapping table:      82 bytes
  Self-Contained:     8,864 bytes

Compression Analysis:
  Pure compression:   22.9%
  Decompressor size:  812 bytes
  Net savings:        15.1%

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
