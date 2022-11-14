import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('User login', () => {
  const userLoginInfo = {
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD
  };

  it('Successful login', async () => {
    const res = await req
      .post('/auth/login')
      .send(userLoginInfo)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.message).toBe('Successful login');
  });

  it('Cookies on login', async () => {
    const res = await req
      .post('/auth/login')
      .send(userLoginInfo)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.headers).toHaveToken();
  });

  it('Bad request', async () => {
    await req
      .post('/auth/login')
      .send({ email: process.env.TEST_USER_EMAIL })
      .set('x-api-key', apiKey)
      .expect(400);
  });
});
