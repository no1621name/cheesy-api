import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Sales', () => {
  it('Returns sales list', async () => {
    const res = await req
      .get('/sales')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.sales).toBeArray();
    res.body.data.sales.forEach(s => expect(s).toHaveKeys(['_id', 'products_ids', 'name', 'preview']));
    expect(res.body.data.sales[0].products_ids).toBeArray();
  });

  it('Returns sale by id', async () => {
    const saleId = 1;
    const res = await req
      .get(`/sales/${saleId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.sale).toHaveKeys(['_id', 'products_ids', 'name', 'preview']);
    expect(res.body.data.sale._id).toEqual(saleId);
  });

  it('Sale by id nt found', async () => {
    await req
      .get('/sales/999999999')
      .set('x-api-key', apiKey)
      .expect(404);
  });
});
