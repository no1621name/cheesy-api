import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Subjects', () => {
  it('Returns subjects', async () => {
    const res = await req
      .get('/subjects')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.subjects).toBeArray();
    res.body.data.subjects.forEach(s => expect(s).toHaveKeys(['_id', 'name'])) ;
  });
});
