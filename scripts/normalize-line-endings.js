const fs = require('fs');
const path = require('path');

const roots = ['src', 'public', 'scripts'];
const extensions = /\.(tsx?|css|json|html|md)$/;

let fixed = 0;

function normalizeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const normalized = content.replace(/\r\n/g, '\n');
  if (normalized !== content) {
    fs.writeFileSync(filePath, normalized, 'utf8');
    fixed += 1;
    console.log('LF:', filePath);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (extensions.test(entry.name)) {
      normalizeFile(fullPath);
    }
  }
}

for (const root of roots) {
  walk(path.join(__dirname, '..', root));
}

['.prettierrc', '.eslintrc.json', '.editorconfig'].forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) normalizeFile(fullPath);
});

console.log(`Normalized ${fixed} file(s) to LF.`);
