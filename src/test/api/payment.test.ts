import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Payment', () => {
  it('Returns payment types list', async () => {
    const res = await req
      .get('/payment')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.paymentTypes).toBeArray();
    res.body.data.paymentTypes.forEach(pt => expect(pt).toHaveKeys(['_id', 'name']));
  });
});
