import request from 'supertest';
import { baseUrl } from '@t/appInfo';

describe('Base test', () => {
  it('Jest works', () => {
    expect(true).toBe(true);
  });

  it('Async works', async () => {
    const res = await request(baseUrl).get('');

    expect(res.ok).toEqual(true);
  });
});
