import { req, apiKey } from '@t/appInfo';

describe('API key', () => {
  it('Error: \'x-api-key\' is required', async () => {
    const res = await req
      .get('/products')
      .expect(401);

    expect(res.body.message).toEqual('\'x-api-key\' is required! For more information check index page');
  });

  it('Header \'x-api-key\' has sent', async () => {
    await req
      .get('/products')
      .set('x-api-key', apiKey)
      .expect(200);
  });
});
