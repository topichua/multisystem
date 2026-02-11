import axios from 'axios';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import { notification } from 'antd';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authorization'); // Replace this with how you retrieve your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return toCamelCase(response.data);
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear the authorization token
      localStorage.removeItem('authorization');
      window.location.reload();
    } else {
      if (error.response.status == 500) {
        const message = error.response?.data?.message || 'An error occurred';
        const description = error.response?.statusText || 'Error Details';
        notification.error({
          message: `Request Failed: ${message}`,
          description,
          duration: 4.5,
        });
      }
      return Promise.reject(error);
    }
  }
);

function deepMapKeys<T>(param: T, mapper: (key: string) => string): T {
  if (!(typeof param === 'object') || param instanceof File || !param) {
    return param;
  }
  if (Array.isArray(param)) {
    // coerce T to []
    const arr = param as any[];
    return arr.map((item) => deepMapKeys(item, mapper)) as unknown as T;
  }
  // coerce T to {}
  const obj = param as { [key: string]: any };
  return Object.keys(obj).reduce(
    (record, key) => ({
      ...record,
      [mapper(key)]: deepMapKeys(obj[key], mapper),
    }),
    {}
  ) as T;
}

function applyByPredicate(
  mapper: (key: string) => string,
  predicate: (key: string) => boolean
) {
  return (key: string) => (predicate(key) ? mapper(key) : key);
}

const nameIsNotSpecial = (name: string) => !name.startsWith('$');

export function toCamelCase<T extends object>(obj: T) {
  return deepMapKeys(obj, applyByPredicate(camelCase, nameIsNotSpecial));
}

export function toSnakeCase<T extends object>(obj: T) {
  return deepMapKeys(obj, applyByPredicate(snakeCase, nameIsNotSpecial));
}

export default axiosInstance;
