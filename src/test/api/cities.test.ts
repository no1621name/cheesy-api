import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Cities', () => {
  it('Returns cities list', async () => {
    const res = await req
      .get('/cities')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.cities).toBeArray();
    res.body.data.cities.forEach(c => expect(c).toHaveKeys(['_id', 'district', 'name', 'subject_id'])) ;
  });

  it('Cities by subject id', async () => {
    const subjectId = 1;
    const res = await req
      .get(`/cities?subject=${subjectId}`)
      .set('x-api-key', apiKey)
      .expect(200);

      res.body.data.cities.forEach(c => expect(c.subject_id === subjectId).toBeTruthy());
  });

  it('Cities by subject id are not found', async () => {
    await req
      .get('/cities?subject=9999')
      .set('x-api-key', apiKey)
      .expect(404);
  });


  it('Returns city by id', async () => {
    const cityId = 1;
    const res = await req
      .get(`/cities/${cityId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.city).toHaveKeys(['_id', 'district', 'name', 'subject_id']);
    expect(res.body.data.city._id).toEqual(cityId);
  });

  it('City by id is not found', async () => {
    await req
      .get('/cities/999999')
      .set('x-api-key', apiKey)
      .expect(404);
  });
});
