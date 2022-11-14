import { req } from '@t/appInfo';

describe('Base test', () => {
  it('Jest works', () => {
    expect(true).toBe(true);
  });

  it('Async works', async () => {
    await req.get('/health').expect(200);
  });
});
