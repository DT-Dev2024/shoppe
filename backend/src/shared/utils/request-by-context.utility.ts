import * as httpContext from 'express-http-context';

export function initRequestContext() {
  return httpContext.middleware;
}

export function getFromContextRequest(key: string) {
  return httpContext.get(key);
}

export function setToContextRequest(key: string, value: unknown) {
  return httpContext.set(key, value);
}
