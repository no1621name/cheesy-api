import { CompatibilityEvent } from 'h3';
import db from '@/db';
import checkResponse from '@/utils/checkResponse';
import ServerResponse from '@/utils/serverResponse';
import getTokenInfo from '@/utils/getTokenInfo';

export default eventHandler(async (e: CompatibilityEvent) => {
  const tokenInfo = await getTokenInfo(useCookie(e, 'token'));
  const { _id } = tokenInfo.payload;

  const users = db.collection('users');
  const user = await users.findOne<User>({ _id });

  checkResponse(user, 'User not found');

  return new ServerResponse(200, { user });
});
