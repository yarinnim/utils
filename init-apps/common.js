const { existsSync, readFileSync, writeFileSync } = require('fs');

/**
 * Checks to see if the defined appName already exists of not
 * @param {string} appName - Application name (folder name)
 * @return boolean
 */
const appExists = (appName = false) => existsSync(`./apps/${appName}`);

/**
 * Reads content from a json file
 * and convert into JS Object
 * @param {string} filePath - Path of file to read
 * @returns object
 */
const readJsonFile = (filePath) => {
  const content = readFileSync(filePath);
  return JSON.parse(content);
};

/**
 * Writes the JSON content into the json file
 * @param {string} filePath - Path to write to
 * @param {object} jsonContent - The content to write to
 */
const writeJsonFile = (filePath, jsonContent) => {
  writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf8', (error) => {
    if (error) {
      console.error(error);
    }
  });
};

const getParams = (pParams = false) => {
  const params = pParams || (() => {
    const [_node, _app, ...rest] = process.argv;
    return rest;
  })();

  return params.reduce((carry, param) => {
    const [key, value = true] = param.split('=');
    return {
      ...carry,
      [key]: value,
    };
  }, {});
};

module.exports = {
  appsPath: '/apps',
  appExists,
  getParams,
  readJsonFile,
  writeJsonFile,
};
