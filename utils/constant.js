const fs = require('fs');
const path = require('path');
const { readFile } = require('./common');

let content = false;
const FILE_PATH =  path.resolve('src/constants.ts');

const getValueType = (value) => Array.isArray(value)
  ? value
  : [value, 'string'];

const getConstants = () => {
  if ( content !== false) return content;
  content = readFile(FILE_PATH, { json: false })
    .split('\n')
    .reduce((accu, key) => {
      if (key === '') return accu;
      return { ...accu, [key]: true };
    }, {});

  return content;
};

const setContent = (data) => {
  content = data;
  return content;
}

const getLine = (key, value) => {
  const type = getValueType(value)[1];
  return  `export const ${key} = getEnv('${key}') as ${type};`;
}

const addConstants = (props) => {
  content = Object.keys(props).reduce((accu, key) => {
    const field = getLine(key, props[key]);
    return { ...accu, [field]: true };
  }, getConstants());
  return content;
};

const removeConstants = (props, { save = false } = {}) => {
  const defConst = getConstants();
  const touchedConsts = Object.keys(props).reduce((accu, key) => {
    const line = getLine(key, props[key]);
    delete accu[line];
    return accu;
  }, defConst);
  setContent(touchedConsts);
  if (save) return saveConstants();
  return getConstants();
}

const saveConstants = () => {
  const lines = Object.keys(getConstants()).join('\n');
  return fs.writeFileSync(FILE_PATH, lines);
};

module.exports = {
  addConstants,
  getConstants,
  getValueType,
  removeConstants,
  saveConstants,
};
