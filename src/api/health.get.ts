import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(() => {
  return new ServerResponse(200, { message: 'health'});
});
