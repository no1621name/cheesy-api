import { CompatibilityEvent } from 'h3';
import setToken from '@/utils/setToken';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default  eventHandler(async (e: CompatibilityEvent) => {
  const { email, password } = await useBody<{ email: string, password: string }>(e);

  if (!(email && password)) { ServerResponse.throwServerError(400); }

  const users = db.collection('users');

  const userData = await users.findOne<User>({ email, password });

  if (!userData) {
    ServerResponse.throwServerError(401);
  } else {
    await setToken(e, userData);
    return new ServerResponse(201, { message: 'Successful login' });
  }
});
