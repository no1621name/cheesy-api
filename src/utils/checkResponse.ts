import ServerResponse from './serverResponse';

export default <T>(res: T, errMesage = 'Required data not found'): void => {
  if (Array.isArray(res) && !res.length) { ServerResponse.throwServerError(404, errMesage); }
  if (!res) { ServerResponse.throwServerError(404, errMesage); }
};
