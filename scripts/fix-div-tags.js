const fs = require('fs');
const path = require('path');

const wrong = ['m', 'o', 't', 'i', 'o', 'n'].join('');
const right = ['d', 'i', 'v'].join('');

function fixContent(content) {
  return content
    .split(`<${wrong} `).join(`<${right} `)
    .split(`<${wrong}>`).join(`<${right}>`)
    .split(`</${wrong}>`).join(`</${right}>`);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith('.tsx')) continue;
    const before = fs.readFileSync(full, 'utf8');
    const after = fixContent(before);
    if (after !== before) {
      fs.writeFileSync(full, after);
      console.log('fixed', full);
    }
  }
}

walk(path.join(__dirname, '..', 'src'));
