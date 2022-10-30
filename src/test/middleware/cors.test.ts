import request from 'supertest';
import { apiKey, baseApiUrl } from '@t/appInfo';

describe('Cors headers', () => {
  it('Headers are setted', async () => {
    const res = await request(baseApiUrl)
			.get('/products')
      .set('x-api-key', apiKey);

    expect(res.ok).toEqual(true);
    expect(res.headers['access-control-allow-credentials']).toBeDefined();
  });
});
