const dotenv = require('dotenv');
const fs = require('fs');

const readEnv = (path) => {
  const { parsed } = dotenv.config({ path });
  return parsed;
}

const getValueType = (value) => Array.isArray(value)
  ? value
  : [value, 'string'];

const addEnv = (envs, defEnv) => {
  const env = Object.keys(defEnv).reduce((accu, key) => {
    const [value] = getValueType(defEnv[key]);
    return {
      ...accu,
      [key]: value,
    };
  }, {});
  return { ...envs, ...env };
};

const removeEnv = (envs, defEnv) => {
  const keys = Object.keys(defEnv);
  const touchedEnv = keys.reduce((accu, key) => {
    delete accu[key];
    return accu;
  }, envs);
  return touchedEnv;
};

const writeEnv = (path, envObj) => {
  const lines = Object.keys(envObj).reduce((accu, key) => {
    const val = envObj[key];
    const line = `${key}=${val}`;
    return [...accu, line];
  }, []);
  return fs.writeFileSync(path, lines.join('\n'));
}

module.exports = {
  readEnv,
  addEnv,
  removeEnv,
  writeEnv,
};
