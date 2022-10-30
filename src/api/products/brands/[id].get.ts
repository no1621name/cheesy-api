import { CompatibilityEvent } from 'h3';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const _id = +e.context.params.id;

  if (!useIsNumber(_id)) { throw ServerResponse.throwServerError(400); }

  const brandsCollection = db.collection('brands');

  const brandInfo = await brandsCollection.findOne({ _id });

  return new ServerResponse(200, { brand: brandInfo, });
});
