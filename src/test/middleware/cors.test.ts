import { req, apiKey } from '@t/appInfo';

describe('Cors headers', () => {
  it('Headers are setted', async () => {
    const res = await req
			.get('/products')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.headers['access-control-allow-credentials']).toBeDefined();
  });
});
