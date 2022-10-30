import request from 'supertest';
import { baseApiUrl, apiKey } from '@t/appInfo';
import '@t/matchers/toHaveKeys';

describe('Subjects', () => {
  it('Returns subjects by country id', async () => {
    const res = await request(baseApiUrl)
      .get('/subjects')
      .query({
        country: '1'
      })
      .set('x-api-key', apiKey);

    expect(res.ok).toEqual(true );
    expect(Array.isArray(res.body.data.subjects)).toBeTruthy();
    expect(res.body.data.subjects[0]).toHaveKeys(['_id', 'name', 'country_id', 'cities_ids']);
  });

  it('Throws bad request error', async () => {
    const res = await request(baseApiUrl)
      .get('/subjects')
      .set('x-api-key', apiKey);

    expect(res.badRequest).toEqual(true);
  });
});
