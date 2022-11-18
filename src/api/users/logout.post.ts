import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler((e) =>{
  setCookie(e, 'token', null);
  setCookie(e, 'checkToken', null);

  return new ServerResponse(201, { message: 'Successfully logged out'});
});
