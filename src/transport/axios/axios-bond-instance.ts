import axios from 'axios';
import { notification } from 'antd';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface MyJwtPayload extends JwtPayload {
  accessToken?: string;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BOND_URL,
});

export const getAuthorizationHeader = (): string => {
  const token = localStorage.getItem('authorization');

  if (!token) {
    throw new Error('Authorization token not found');
  }

  let decodedToken: MyJwtPayload | null = null;

  try {
    decodedToken = jwtDecode<MyJwtPayload>(token);
  } catch (error) {
    throw new Error('Failed to decode token');
  }

  if (!decodedToken || !decodedToken.accessToken) {
    throw new Error('Access token is missing in decoded token');
  }

  return `Bearer ${decodedToken.accessToken}`;
};

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      config.headers.Authorization = getAuthorizationHeader();
    } catch (error) {
      console.error('Authorization error:', error);
      throw error;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const responseType = response.request?.responseType;
    if (responseType === 'blob' || responseType === 'arraybuffer')
      return response.data;

    return toCamelCase(response.data);
  },
  (error) => {
    if (error.response?.status === 500) {
      notification.error({
        message: error.message || 'An error occurred',
        description: error.response?.data?.error_description || 'Error Details',
        duration: 4.5,
      });
    }
    return Promise.reject(error);
  }
);

function deepMapKeys<T>(param: T, mapper: (key: string) => string): T {
  if (!(typeof param === 'object') || param instanceof File || !param) {
    return param;
  }
  if (Array.isArray(param)) {
    return param.map((item) => deepMapKeys(item, mapper)) as unknown as T;
  }
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
