import ServerResponse from '@/utils/serverResponse';

export default eventHandler(() => {
  return new ServerResponse(200, { message: 'health'});
});
