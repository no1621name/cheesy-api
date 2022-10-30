import request from 'supertest';
import { baseApiUrl, apiKey } from '@t/appInfo';

describe('API key', () => {
  it('Error: \'x-api-key\' is required', async () => {
    const res = await request(baseApiUrl).get('/products');

    expect(res.unauthorized).toBe(true);
    expect(res.body.message).toEqual('\'x-api-key\' is required! For more information check index page');
  });

  it('Header \'x-api-key\' has sent', async () => {
    const res = await request(baseApiUrl)
      .get('/products')
      .set('x-api-key', apiKey);

    expect(res.ok).toEqual(true);
  });
});
