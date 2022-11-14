import { expect } from '@jest/globals';

const sortExecuters = {
  _id: {
    asc: (prev: number, curr: { _id: number }) =>
      prev < curr._id ? curr._id : -1,
    desc: (prev: number, curr: { _id: number }) =>
      prev >= curr._id ? curr._id : -1,
  },
  price: {
    asc: (prev: number, curr: { price: number }) =>
      prev < curr.price ? curr.price : -1,
    desc: (prev: number, curr: { price: number }) =>
      prev >= curr.price ? curr.price : -1,
  },
  date: {
    asc: (prev: string, curr: { date: string }) =>
      prev <= curr.date ? curr.date : -1,
    desc: (prev: string, curr: { date: string }) =>
      prev >= curr.date ? curr.date : -1,
  },
};

expect.extend({
  toBeArray(unk: unknown) {
    const pass = Array.isArray(unk);
    return {
      message: () => `Argument is ${pass? '' : 'not'} array`,
      pass,
    };
  },

  toHaveToken(headers: { 'set-cookie'?: string[] }) {
    const pass = Object.keys(headers).includes('set-cookie') &&
      headers['set-cookie'].some((c: string) => c.includes('token=')) &&
      headers['set-cookie'].some((c: string) => c.includes('checkToken='));

    return {
      message: () => `Request has ${pass? '' : 'not'} token cookies`,
      pass,
    };
  },

  toHaveKeys(object: object, keys: string[]) {
    const objectKeys = Object.keys(object).sort();
    const pass = objectKeys.length === keys.length && JSON.stringify(objectKeys) === JSON.stringify(keys.sort());

    return {
      message: () => `Keys ${pass? '' : 'not'} equal`,
      pass,
    };
  },

  toHavePagination(data: { pagination?: Pagination }) {
    const pass = data.pagination &&
      JSON.stringify(Object.keys(data.pagination)) === JSON.stringify([
        'total',
        'next',
        'prev',
        'limit',
        'current',
      ]) && Object.values(data.pagination).every(v => typeof v === 'number');

    return {
      message: () => `Request has ${pass ? '' : 'not'} pagination`,
      pass,
    };
  },

  toBeSortedBy(arr: any[], type: SortTypes, method: 'asc' | 'desc', def: any) {
    const pass = arr.reduce(sortExecuters[type][method], def) !== -1;

    return {
      message: () => `Array ${pass ? 'sorted' : 'did not sort'} by ${type}.${method}`,
      pass,
    };
  }
});
