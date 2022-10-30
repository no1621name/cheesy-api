import ServerResponse from '@/utils/serverResponse';
import { jwtVerify } from 'jose';
import secretKey from '@/secretKey';

export default async (token: string | string[] | undefined) => {
  if (!token || Array.isArray(token)) { throw ServerResponse.throwServerError(403); }
  const tokenInfo = await jwtVerify(token, secretKey);
  return tokenInfo;
};
