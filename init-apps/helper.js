const { execSync } = require('child_process');
const { resolve } = require('path');
const { readdirSync, statSync } = require('fs');

const exec = (cli) => execSync(cli, { stdio: 'inherit' });
const appsDir = '/apps';
const packagesDir = '/packages';

const rootPath = (dir) => resolve(`${__dirname}/..${dir || ''}`);
const appsPath = (dir = '') => rootPath(`${appsDir}/${dir}`);
const packagesPath = (dir = '') => rootPath(`${packagesDir}/${dir}`);

const getUsedWorkspacePaths = () => {
  const { workspaces } = require(rootPath('/package.json'));
  return workspaces.map((path) =>  rootPath(`/${path}`));
};


const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};


module.exports = {
  appsDir, 
  packagesDir,
  appsPath,
  exec,
  packagesPath,
  getUsedWorkspacePaths,
  getAppPaths: () => {
    const dirs = readdirSync(appsPath());
    return dirs.reduce((carry, dir) => {
      const fullPath = appsPath(dir);
      return statSync(fullPath).isDirectory()
        ? [...carry, fullPath]
        : carry;
    }, []);
  },

  getPackagePaths: () => {
    const paths = readdirSync(packagesPath());
    return paths.reduce((carry, path) => {
      const fullPath = packagesPath(path);
      const stat = statSync(fullPath);
      if (!stat.isDirectory()) return carry;
      return [...carry, fullPath];
    }, []);
  },
  rootPath,
  colorLog: (msg, ...colors) => {
    const strColor = colors.map((color) => COLORS[color] || '').join('');
    console.log(strColor);
    console.log(`${COLORS.bright}${strColor}%s${COLORS.reset}`, msg);
  },
};
