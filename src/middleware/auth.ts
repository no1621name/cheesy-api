import { CompatibilityEvent, eventHandler } from 'h3';
import { jwtVerify } from 'jose';
import ServerResponse from '@/utils/serverResponse';
import secretKey from '@/secretKey';

export default eventHandler(async (e: CompatibilityEvent) => {
  const url = e.req.url;

  if ((url.includes('users') && !url.includes('recover') && !url.includes('logout')) ||
      (url.includes('reviews') && e.req.method === 'POST') ||
      url.match(/orders\/\d/gi)
    ) {
    const token = useCookie(e, 'token');
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
