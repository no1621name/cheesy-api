import { jwtVerify } from 'jose';
import ServerResponse from '@/utils/serverResponse';
import secretKey from '@/secretKey';

const exceptions = [
  '/api/users/recover',
  '/api/users/logout'
];

export default defineEventHandler(async (e) => {
  const url = e.req.url;

  if (!exceptions.includes(url) && ((url.includes('users')) ||
      (url.includes('reviews') && e.req.method === 'POST') ||
      url.match(/orders\/\d/gi))
    ) {
    const token = getCookie(e, 'token');
    if (!token || Array.isArray(token)) {
      ServerResponse.throwServerError(401);
    } else {
      const { payload } = await jwtVerify(token, secretKey);
      if (!payload) {
        ServerResponse.throwServerError(400, 'Bad token');
      }
    }
  }
});
