import { SignJWT } from 'jose';
import { CompatibilityEvent, setCookie } from 'h3';
import secretKey from '@/secretKey';

export default async (e: CompatibilityEvent, userInfo: Pick<User, '_id' | 'role'>) => {
  const now = new Date();
  const expireTime = now.getTime() + 1000 * 60 * 60 * 24;
  now.setTime(expireTime);

  const newToken = await new SignJWT(userInfo)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  setCookie(e, 'token', newToken, {
    expires: now,
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/',
  });

  setCookie(e, 'checkToken', 'exists', {
    expires: now,
    sameSite: 'none',
    secure: true,
    httpOnly: false,
    path: '/',
  });

  return newToken;
};
