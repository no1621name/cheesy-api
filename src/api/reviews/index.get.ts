import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import useIsNumber from '@/utils/useIsNumber';

export default eventHandler(async (e: CompatibilityEvent) => {
  const {
    id = 0,
    limit = 6,
    offset = 0,
  } = useQuery(e);

  const _id = Number(id);
  const offsetValue = +offset;
  const limitValue = +limit;

  if (!(
    limitValue > 0 &&
    useIsNumber(_id) &&
    useIsNumber(offsetValue) &&
    useIsNumber(limitValue))) { ServerResponse.throwServerError(400); }

  const findParams: { product_id?: number } = {};

  if (_id > 0) {
    findParams.product_id = _id;
  }

  const reviewsCollection = db.collection('reviews');

  const reviews: Review[] = await reviewsCollection
    .find<Review>(findParams)
    .skip(offsetValue)
    .limit(limitValue)
    .toArray();

  return await new ServerResponse(200, { reviews }).withPagination(reviewsCollection, findParams, offsetValue, limitValue);
});
