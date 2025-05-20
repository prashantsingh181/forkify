import type { APIResponse, ValidationObject } from "../types";
import { TIMEOUT_SEC } from "./config";

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
    throw new Error("Unexpected response type");
  }
  const responseJSON: APIResponse<T> = await response.json();
  if (responseJSON.status === "fail") {
    throw new Error(responseJSON.message);
  }
  return responseJSON;
}

type AJAXOptions<TData = any> = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestBody?: TData;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | undefined | null>;
};

export async function AJAX<TReturn = any, TData = any>(
  url: string,
  {
    method = "GET",
    queryParams = {},
    headers = {},
    requestBody,
  }: AJAXOptions<TData> = {}
) {
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (
      (typeof value === "number" && isNaN(value)) ||
      value === null ||
      value === undefined
    )
      return;
    searchParams.append(key, String(value));
  });

  const requestUrl = `${url}${
    searchParams.toString() ? `?${searchParams}` : ""
  }`;

  const requestPromise = fetch(requestUrl, {
    method,
    headers: {
      "Content-Type": requestBody ? "application/json" : "",
      ...headers,
    },
    body: requestBody ? JSON.stringify(requestBody) : undefined,
  });

  const response = await Promise.race([requestPromise, timeout(TIMEOUT_SEC)]);

  if (!(response instanceof Response)) {
    throw new Error("Request timed out");
  }
  const responseJSON: APIResponse<TReturn> = await response.json();
  if (responseJSON.status === "fail") {
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
  } else if (obj !== null && typeof obj === "object") {
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

export function validateForm(
  object: Record<string, string>,
  validation: Record<string, ValidationObject>
) {
  const errors: Record<string, string> = {};
  for (const key in object) {
    const value = object[key];
    const validationRules = validation[key];
    if (!validationRules) continue;

    if (validationRules.required?.value && !value) {
      errors[key] = validationRules.required.message ?? `${key} is required`;
      continue;
    }
    if (
      validationRules.minLength &&
      value.length < validationRules.minLength.value
    ) {
      errors[key] =
        validationRules.minLength.message ??
        `${key} should be at least ${validationRules.minLength.value} characters`;
      continue;
    }
    if (
      validationRules.maxLength &&
      value.length > validationRules.maxLength.value
    ) {
      errors[key] =
        validationRules.maxLength.message ??
        `${key} should not have more than ${validationRules.maxLength.value} characters`;
      continue;
    }
    if (validationRules.regex && !validationRules.regex.value.test(value)) {
      errors[key] = validationRules.regex.message ?? `${key} is not valid`;
    }
  }
  return errors;
}
