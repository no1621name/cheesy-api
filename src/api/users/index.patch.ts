import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import getTokenInfo from '@/utils/getTokenInfo';

export default eventHandler(async (e: CompatibilityEvent) => {
  const tokenInfo = await getTokenInfo(useCookie(e, 'token'));
  const { _id } = tokenInfo.payload;
  const { newUserData } = await useBody(e);

  if (!newUserData) { throw ServerResponse.throwServerError(400); }

  const usersCollection = db.collection('users');
  const userData = await usersCollection.findOne<User>({ _id });

  if (!userData) { throw ServerResponse.throwServerError(400); }

  const fieldsForUpdate = new Map([]);

  Object.keys(userData).forEach((key: string) => {
    const userDataValue = userData[key as keyof User];
    const newUserDataValue = newUserData[key];

    if (!newUserDataValue) {
      return;
    }

    if ((typeof userDataValue === 'object' || typeof newUserDataValue === 'object')) {
      if (JSON.stringify(userDataValue) !== JSON.stringify(newUserDataValue)) {
        fieldsForUpdate.set(key, newUserDataValue);
      }
      return;
    }

    if (newUserDataValue !== userDataValue && typeof newUserDataValue === typeof userDataValue) {
      fieldsForUpdate.set(key, newUserDataValue);
    }
  });

  if (!fieldsForUpdate.size) { return new ServerResponse(200, { message: 'Continue'}); }

  await usersCollection.findOneAndUpdate({ _id }, { $set: Object.fromEntries(fieldsForUpdate) })
    .catch(() => { throw ServerResponse.throwServerError(500); });

  return new ServerResponse(201, { message: 'User successfully changed' });
});
