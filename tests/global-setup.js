const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const srcDir = path.resolve(__dirname, '../firefox-extension');
  const destDir = path.resolve(__dirname, '../temp-firefox-extension');

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  fs.mkdirSync(destDir, { recursive: true });

  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach((childItemName) => {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursiveSync(srcDir, destDir);

  const replaceInFiles = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        replaceInFiles(fullPath);
      } else if (fullPath.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/browser\./g, 'chrome.');
        fs.writeFileSync(fullPath, content, 'utf8');
      } else if (fullPath.endsWith('manifest.json')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let manifest = JSON.parse(content);
        if (manifest.browser_specific_settings) {
          delete manifest.browser_specific_settings;
        }
        if (manifest.background && manifest.background.scripts) {
          manifest.background = {
            service_worker: manifest.background.scripts[0]
          };
        }
        fs.writeFileSync(fullPath, JSON.stringify(manifest, null, 2), 'utf8');
      }
    });
  };

  replaceInFiles(destDir);
};
