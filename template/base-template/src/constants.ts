import dotenv from 'dotenv';

dotenv.config();

type Env = string | number | boolean;

function getEnv<T extends Env = string>(key: string): T {
  const result = process.env[key];
  if (result === undefined) throw new Error(`The ${key} environment variable is required`);
  return result as T;
};

export const DEBUG_MODE = getEnv<boolean>('DEBUG_MODE').toString().includes('true');
export const APP_PORT = getEnv('APP_PORT') as number;
export const APP_ENV = getEnv('APP_ENV');
export const APP_NAME = getEnv('APP_NAME');
