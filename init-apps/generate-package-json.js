const {
  readFileSync,
  mkdirSync,
  cpSync,
  existsSync,
} = require('fs');
const { resolve } = require('path');
const { packagesPath } = require('./common'); 
const basePackageJson = require('./package.json');

const rootDir = resolve();

const getAppPackageJson = (appPath) => {
  const jsonFile = `${appPath}/package.json`;
  return JSON.parse(readFileSync(jsonFile));
};

const getAppTSConfig = (appPath) => {
  const tsConfig = `${appPath}/tsconfig.json`;
  return JSON.parse(readFileSync(tsConfig));
};

/**
 * At current version, TypeScript does not support
 * the `exports` properties of package.json, so we need
 * to make `package.json` available in the `build`
 * (the root folder of build pacakge), so this will
 * create `build` folder (if not exists) and copy
 * the package.json into the created folder (build).
 *
 * @todo - Will be remove when TypeScript supports
 * `exports` package.json properties.
 */
const createBuildPath = (packagePath) => {
  const buildPath = `${packagePath}/build`;
  mkdirSync(buildPath, { recursive: true });
  cpSync(`${packagePath}/package.json`, `${buildPath}/package.json`);
  const srcBin = `${packagePath}/bin`;
  if (existsSync(srcBin)) {
    const destBin = `${buildPath}/bin`;
    const exists = existsSync(destBin);
    exists || cpSync(srcBin, destBin, { recursive: true, force: true });
  }

  const stylesPath = `${packagePath}/src/styles`;
  if (existsSync(stylesPath)) {
    cpSync(stylesPath, `${buildPath}/styles`, { recursive: true });
  }

  return buildPath;
};

/**
 * Get workspaces to put into application package.json
 * by getting the referrences from src/tsconfig.json of
 * the application
 * @param {string} appPath: The qualify
 * @param {any} tsConfig: The application TS Config
 * @return array
 */
const getWorkspaces = (app, { references = [] }) => {
  const ws = references.map(({ path }) => {
    const [_dir, refPath] = path.split(packagesPath);
    // const packagePath = `.${packagesPath}${refPath}`;
    const packagePath =  '.' + resolve(`${app}/${path}`).replace(rootDir, '');
    return createBuildPath(packagePath);
  });
  return [app, ...ws];
};

/**
 * Gets the scripts registered in the package.json
 * of the provided application
 * @param {any} packageJson: The package json of the app
 * @param {string} name: The app name (@ltlabs/ltq-api)
 * @return any: The object if listed scripts
 */
const getAppScripts = ({ scripts = {}, name }, { withSuffix = false }) => {
  const scriptNames = Object.keys(scripts);
  return scriptNames.reduce((carry, scriptName) => {
    const suffix = withSuffix
      ? `@${name.split('/')[1]}`
      : '';
    return {
      ...carry,
      [`${scriptName}${suffix}`]: `npm run -w ${name} ${scriptName}`,
    };
  }, { [name]: '=========== SCRIPTS =============' });
};

/**
 * Generate single appliation with required workspaces
 * that defined under its tsconfig.json's references
 */
const getSingleApp = ({ appPath, app, withSuffix = false }) => {
  const packageJson = getAppPackageJson(appPath);
  const tsConfig = getAppTSConfig(appPath);

  const workspaces = getWorkspaces(app, tsConfig);

  const scripts = getAppScripts(packageJson, { withSuffix });
  return {
    workspaces,
    scripts,
  };
};

/**
 * Generates packages content for multiple applications
 * @return any: package.json content
 */
const generateMultiApps = ({ apps }) => {
  const res = apps.reduce((carry, app) => {
    const { workspaces: pWorkspaces, scripts: pScripts } = carry;
    const { workspaces, scripts } = getSingleApp({ app, appPath: app, withSuffix: true });
    return {
      workspaces: [...pWorkspaces, ...workspaces],
      scripts: { ...pScripts, ...scripts },
    };
  }, { workspaces: [], scripts: {} });

  return {
    ...basePackageJson,
    ...res,
    workspaces: [...new Set(res.workspaces)],
  };
};

module.exports = {
  generateSingleApp: (props) => ({
    ...basePackageJson,
    ...getSingleApp(props),
  }),
  generateMultiApps,
};
