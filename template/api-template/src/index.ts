/* eslint-disable no-console */
import api, { type API } from '@core/api';
import logger from './log-client';
import { APP_PORT, APP_ENV, APP_NAME } from './constants';
import routes from './routes';

const apiProps: API = {
  port: APP_PORT, appEnv: APP_ENV, appName: APP_NAME,
  routes, logger,
} as any;

api(apiProps).catch(console.error);
