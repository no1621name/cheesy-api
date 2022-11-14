import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Token middleware', () => {
  it('Throws error on orders/[id] request', async () => {
    await req
      .get('/orders/1')
      .set('x-api-key', apiKey)
      .expect(401);
  });

  it('Throws error on users requests', async () => {
    await req
      .get('/users')
      .set('x-api-key', apiKey)
      .expect(401);

    await req
      .delete('/users')
      .set('x-api-key', apiKey)
      .expect(401);

    await req
      .patch('/users')
      .set('x-api-key', apiKey)
      .expect(401);

    await req
      .patch('/users/reset')
      .set('x-api-key', apiKey)
      .expect(401);
  });

  it('Throws error on reviews POST request', async () => {
    await req
      .post('/reviews')
      .set('x-api-key', apiKey)
      .expect(401);
  });
});
