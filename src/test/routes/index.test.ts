import request from 'supertest';
import { baseUrl } from '@t/appInfo';

describe('Index route', () => {
  it('Index page returns a greeting message', async () => {
    const res = await request(baseUrl).get('');

    expect(res.ok).toEqual(true);
    expect(res.text).toContain('Hello!');
  });
});
