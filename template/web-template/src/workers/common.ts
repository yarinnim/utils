/* eslint-disable no-console */

export function register() {
  const { serviceWorker = false } = navigator;
  if (!serviceWorker) return false;
  return serviceWorker
    .register('workers/index.js')
    .then((result: any) => {
      console.log('Service Worker Register Successfully');
      console.log({ result });
    })
    .catch((error: any) => {
      const { message, stack } = error;
      console.error('Failed in registering service worker', error);
      console.error({ message, stack });
    });
}

export const test = '';
