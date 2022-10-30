import { CompatibilityEvent } from 'h3';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler((e: CompatibilityEvent) =>{
  setCookie(e, 'token', null);
  setCookie(e, 'checkToken', null);

  return new ServerResponse(201, { message: 'Successfully logged out'});
});
