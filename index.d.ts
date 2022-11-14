/* eslint-disable no-unused-vars */
/// <reference types="cheesy-api-types-package" />

declare global {
  type QueryValue = string | string[];
  type SortTypes = '_id' | 'date' | 'price';

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveKeys(keys: string[]): R;
      toBeArray(): R;
      toHaveToken(): R;
      toHavePagination(): R;
      toBeSortedBy(by: SortTypes, method: 'asc'|'desc', def: any): R;
    }
  }

}

export { };
