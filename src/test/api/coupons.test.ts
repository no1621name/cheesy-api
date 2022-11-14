import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Coupons', () => {
  it('Returns coupons list', async () => {
    const res = await req
      .get('/coupons')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.coupons).toBeArray();
    res.body.data.coupons.forEach(c => expect(c).toHaveKeys([
      '_id','discountValue',
      'expires', 'code'
    ]));
  });

  it('Coupon by code', async () => {
    const code = 'k9DOK2po';

    const res = await req
      .get('/coupons')
      .set('x-api-key', apiKey)
      .query({code})
      .expect(200);

    expect(res.body.data.coupon).toHaveKeys([
      '_id','discountValue',
      'expires', 'code'
    ]);
    expect(res.body.data.coupon.code).toBe(code);
  });

  it('Coupon\'s code expired', async () => {
    await req
      .get('/coupons')
      .set('x-api-key', apiKey)
      .query({code: '12rKzADf'})
      .expect(400);
  });

  it('Coupon by id', async () => {
    const id = 1;

    const res = await req
      .get(`/coupons/${id}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.coupon).toHaveKeys([
      '_id','discountValue',
      'expires', 'code'
    ]);
    expect(res.body.data.coupon._id).toEqual(id);
  });
});
