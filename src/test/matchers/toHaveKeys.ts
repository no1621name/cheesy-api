/* eslint-disable no-unused-vars */
import { expect } from '@jest/globals';

expect.extend({
  toHaveKeys(object: object, keys: string[]) {
    const objectKeys = Object.keys(object);
    const pass = objectKeys.length === keys.length && JSON.stringify(objectKeys) === JSON.stringify(keys);
    return {
      message: () => `Keys ${pass? '' : 'not'} equal`,
      pass,
    };
  },
});
