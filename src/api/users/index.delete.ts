import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import getTokenInfo from '@/utils/getTokenInfo';

export default eventHandler(async (e) => {
  const tokenInfo = await getTokenInfo(getCookie(e, 'token'));
  const { _id } = tokenInfo.payload;

  const users = db.collection('users');

  await users.findOneAndDelete({ _id })
    .catch(() => { throw ServerResponse.throwServerError(500); });

  return new ServerResponse(201, { message: 'User successfully deleted' });
});
