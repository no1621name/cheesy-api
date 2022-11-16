import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e) => {
  const { newPassword, oldPassword } = await readBody(e);

  if (!(newPassword && oldPassword)) { throw ServerResponse.throwServerError(400); }

  const users = db.collection('users');
  const user = await users.findOne<User>({ password: oldPassword });

  if (!user) { throw ServerResponse.throwServerError(400); }

  await users.findOneAndUpdate({ password: oldPassword }, { $set: { password: newPassword } })
    .catch(() => { throw ServerResponse.throwServerError(500); });

  return new ServerResponse(201, { message: 'Password successfully changed' });
});
