const { existsSync } = require('fs');
const { resolve } = require('path');

function validateApp(props) {
  const [_node, _app, appWithScope] = process.argv;
  if (!(appWithScope || false)) throw new Error('Please provide the application name');

  const [pScope, app] = appWithScope.split('/');
  if(!(app || false)) throw new Error('App must be with a scope. Eg. $> ./bin/init-web common/test-web');

  const { template, dest = 'apps' } = props;
  const scope = pScope.replaceAll('@', '');
  const sourcePath = template;
  const appPath = (file = '') => resolve(`./${dest}/${app}/${file}`);

  const exists = existsSync(appPath());
  if (exists) throw new Error('Application already exists.');

  return { scope, app, sourcePath, appPath };
}

function getApp(app) {
  const appPath = resolve(app);
  const exists = existsSync(appPath);
  if (!exists) throw new Error('Application not found');
  return (file = '') => `${appPath}/${file}`;
}

module.exports = {
  validateApp,
  getApp,
};
