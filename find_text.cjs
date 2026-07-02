const fs = require('fs');
const path = require('path');

function findTextInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findTextInFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/>\s*[A-Z][a-z]+[^<]*</) && !line.includes('{t(')) {
          console.log(`${file}:${i + 1}: ${line.trim()}`);
        }
      }
    }
  }
}

findTextInFiles('/Users/nonarkara/Projects/slic-index/v3-current/src');
