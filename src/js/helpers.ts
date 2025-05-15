import { APIResponse } from '../types';
import { TIMEOUT_SEC } from './config';

const timeout = function (s: number) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function getJSON<T>(url: string) {
  const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
  if (!(response instanceof Response)) {
    throw new Error('Unexpected response type');
  }
  const responseJSON: APIResponse<T> = await response.json();
  if (responseJSON.status === 'fail') {
    throw new Error(responseJSON.message);
  }
  return responseJSON;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function convertKeysToCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as any;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = toCamelCase(key);
      acc[newKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
