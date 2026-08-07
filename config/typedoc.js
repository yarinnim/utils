const { resolve } = require('path');
const config = require(resolve('./tsdoc.js'));
console.log({ config });

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  $schema: 'https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json',
  out: 'tsdocs',
  ...config,
};
