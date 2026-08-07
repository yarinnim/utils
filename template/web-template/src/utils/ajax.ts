import request from '@core/ajax';
import { API_URL } from '@/constant';

const getDefaultHeaders = (headers: any) => ({
  'Application': 'Application',
  ...headers,
});

const handleError = (error: any = {}) => {
  throw error;
};

export const baseURL = (url: string = ''): string => {
  const reqUrl = url.substring(0, 1) === '/' ? `${API_URL}${url}` : url;
  return reqUrl;
};

export default function ajax(url: string, pProps: any = {}) {
  const { headers = {} } = pProps;
  const defaultHeaders = getDefaultHeaders(headers);
  const props = {
    ...pProps,
    headers: defaultHeaders,
  };
  return request(baseURL(url), props)
    .catch(handleError);
}
