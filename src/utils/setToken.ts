import { SignJWT } from 'jose';
import { setCookie } from 'h3';
import secretKey from '@/secretKey';

export default async (e, userInfo: Pick<User, '_id' | 'role'>) => {
  const now = new Date();
  const expireTime = now.getTime() + 1000 * 60 * 60 * 24;
  now.setTime(expireTime);

  const newToken = await new SignJWT(userInfo)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  setCookie(e, 'checkToken', 'exists', {
    expires: now,
    sameSite: 'none',
    secure: true,
    httpOnly: false,
  });

  setCookie(e, 'token', newToken, {
    expires: now,
    sameSite: 'none',
    secure: true,
    httpOnly: true,
  });

  return newToken;
};
