import { apiKey, req } from '@t/appInfo';
import generateRandomString from '@/utils/generateRandomString';
import '@t/matchers';

describe('New user registration', () => {
  const fullname = generateRandomString(12);
  const password = generateRandomString(8);
  const email = generateRandomString(20);

  it('Successful registration', async () => {
    const res = await req
      .post('/auth/regist')
      .set('x-api-key', apiKey)
      .send({
        email,
        fullname,
        password
      })
      .expect(200);

    expect(res.body.data.message).toEqual('Successful registration');
    expect(res.headers).toHaveToken();
  });

  it('Already exists', async () => {
    const res = await req
      .post('/auth/regist')
      .set('x-api-key', apiKey)
      .send({
        email,
        fullname,
        password
      })
      .expect(400);

    expect(res.body.message).toEqual('Already exists');
  });

  it('Bad request', async () => {
    await req
      .post('/auth/regist')
      .send({ email })
      .set('x-api-key', apiKey)
      .expect(400);
  });
});
