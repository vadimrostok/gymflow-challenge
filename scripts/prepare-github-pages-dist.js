const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const paintingsSourceDir = path.join(projectRoot, 'assets', 'paintings');
const paintingsTargetDir = path.join(distDir, 'assets', 'paintings');
const indexHtmlPath = path.join(distDir, 'index.html');
const notFoundHtmlPath = path.join(distDir, '404.html');

if (!fs.existsSync(distDir)) {
  throw new Error('Missing dist directory. Run `expo export --platform web` before this script.');
}

fs.mkdirSync(paintingsTargetDir, { recursive: true });
fs.cpSync(paintingsSourceDir, paintingsTargetDir, { recursive: true });

if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, notFoundHtmlPath);
}

fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
