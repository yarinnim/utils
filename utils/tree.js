const fs = require('fs');
const path = require('path');

function generateTree(dirPath, indent = '') {
  const files = fs.readdirSync(dirPath);
  let output = '';

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    const isDirectory = stats.isDirectory();

    output += indent + (isDirectory ? '├── ' : '├── ') + file + '\n';

    if (isDirectory) {
      output += generateTree(filePath, indent + '│   ');
    }
  });

  return output;
}

module.exports = (path) => {
  const treeOutput = generateTree(path);
  console.log('========================================');
  console.log(`Folder Structure:\n${path}`);
  console.log('=========================================');
  // console.log(treeOutput);
}
