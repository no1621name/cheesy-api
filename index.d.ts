/// <reference types="cheesy-api" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      // eslint-disable-next-line no-unused-vars
      toHaveKeys(keys: string[]): R;
    }
  }

  type QueryValue = string | string[];
}
export {};
