import { CompatibilityEvent } from 'h3';
import checkResponse from '@/utils/checkResponse';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const _id = Number(e.context.params.id);

  if (!(useIsNumber(_id) && _id > 0)) { throw ServerResponse.throwServerError(400); }

  const cities = db.collection('cities');
  const city = await cities.findOne<City>({ _id });

  checkResponse(city, 'City not found');

  return new ServerResponse(200, { city });
});
