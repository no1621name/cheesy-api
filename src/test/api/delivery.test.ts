import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Delivery', () => {
  it('Returns delivery types list', async () => {
    const res = await req
      .get('/delivery')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.deliveryTypes).toBeArray();
    res.body.data.deliveryTypes.forEach(dt => {
      expect(dt).toHaveKeys([ '_id', 'name', 'logo', 'priceList']);
      dt.priceList.forEach(p => expect(p).toHaveKeys(['description', 'value', 'subjects_ids']));
    });
  });

  it('Returns price list by subject', async () => {
    const subjectId = 1;

    const res = await req
      .get('/delivery/price-list')
      .query({subject: subjectId})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.priceList).toBeArray();
    res.body.data.priceList.forEach(dt => {
      expect(dt).toHaveKeys([ '_id', 'name', 'logo', 'priceList']);
      dt.priceList.forEach(p => {
        expect(p).toHaveKeys(['description', 'value', 'subjects_ids']);
        expect(p.subjects_ids.includes(subjectId)).toBeTruthy();
      });
    });
  });

  it('Price list incorrect subject query request', async () => {
    await req
      .get('/delivery/price-list')
      .query({subject: 0})
      .set('x-api-key', apiKey)
      .expect(400);

    await req
      .get('/delivery/price-list')
      .query({subject: [0,1]})
      .set('x-api-key', apiKey)
      .expect(400);
  });
});
