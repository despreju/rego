const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // repo root (adjust if needed)
const exts = new Set(['.css', '.scss', '.less', '.vue', '.ts', '.js', '.html']);
const colorRegex = /(#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))|\b(?:rgba?|hsla?)\([^)]*\)\b/g;

const results = {}; // color -> { rgb: 'r,g,b', occurrences: [{file,line,text}] }

function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  if (hex.length === 4) { // rgba short form
    const r = parseInt(hex[0]+hex[0],16);
    const g = parseInt(hex[1]+hex[1],16);
    const b = parseInt(hex[2]+hex[2],16);
    return `${r}, ${g}, ${b}`;
  }
  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    return `${r}, ${g}, ${b}`;
  }
  return null;
}

function normalizeColor(raw) {
  raw = raw.trim();
  // keep raw form as key (lowercase hex)
  if (raw.startsWith('#')) return raw.toLowerCase();
  // rgba/rgb/hsla/hsl: compact whitespace
  return raw.replace(/\s+/g, ' ').toLowerCase();
}

function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (const name of items) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      scanDir(p);
    } else {
      const ext = path.extname(p).toLowerCase();
      if (!exts.has(ext)) continue;
      const text = fs.readFileSync(p, 'utf8');
      let match;
      const lines = text.split(/\r?\n/);
      while ((match = colorRegex.exec(text)) !== null) {
        const raw = match[0];
        if (raw.includes('var(--')) continue; // ignore variables
        const key = normalizeColor(raw);
        // find line number
        const idx = match.index;
        let lineNo = 1;
        let acc = 0;
        for (let i = 0; i < lines.length; i++) {
          acc += lines[i].length + 1;
          if (acc > idx) { lineNo = i + 1; break; }
        }
        if (!results[key]) results[key] = { occurrences: [] , rgb: null };
        // compute rgb for hex only
        if (key.startsWith('#') && !results[key].rgb) {
          results[key].rgb = hexToRgb(key);
        }
        results[key].occurrences.push({ file: path.relative(root, p), line: lineNo, text: raw });
      }
    }
  }
}

scanDir(root);

const outPath = path.join(root, 'colors-found.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
console.log('Scan terminé — résultats ->', outPath);