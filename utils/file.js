const fs = require('fs');
const path = require('path');

function readFile(filepath, props = {}) {
  const { json = true } = props;
  const data = fs.readFileSync(filepath).toString();
  ref = json ? JSON.parse(data) : data;
  return ref;
}

function writeFile(filename, content) {
  fs.writeFileSync(filename, content);
}

function touchFile(filename, onRead, props = {}) {
  const { json = false } = props;
  const content = readFile(filename, { json });
  const touchedContent = onRead(content);
  writeFile(filename, touchedContent);
}

function absoluteToRelative(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.lstatSync(filePath);
    const isSymlink = stats.isSymbolicLink();
    if (isSymlink) {
      console.log(`[INFO] Update link file [${file}]...`);
      const target = fs.readlinkSync(filePath);
      const relativeTarget = path.relative(dir, target);
      
      fs.unlinkSync(filePath);
      fs.symlinkSync(relativeTarget, filePath);
    }
  });
}

module.exports = {
  touchFile,
  absoluteToRelative,
}
