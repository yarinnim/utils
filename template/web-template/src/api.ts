import { API_URL } from '@/constant';

type API_ROUTE = Record<string, string>;

const api: API_ROUTE = {
  LOGIN: '/login',
};

const proxyHandler = {
  get(target: API_ROUTE, prop: string | symbol, receiver: unknown) {
    if (typeof prop === 'symbol') return undefined;
    const value = Reflect.get(target, prop, receiver);
    return `${API_URL}${value}`;
  },

  set() {
    throw new Error('The API Value is read-only.');
  }
};

export default new Proxy(api, proxyHandler);
