import { CompatibilityEvent } from 'h3';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import useQueryToArray from '@/utils/useQueryToArray';
import ServerResponse from '@/utils/serverResponse';
import shortProductFields from '@/utils/shortProductFields';

export default eventHandler(async (e: CompatibilityEvent) => {
  const {
    ids = [],
    short = 0,
  } = useQuery(e);

  const idsValue = useQueryToArray(ids);
  const shortValue = +short;

  const isValidIds = idsValue
    .every((id: number) =>  useIsNumber(id) && id !== 0);

  if(!isValidIds || !useIsNumber(shortValue)) {
    ServerResponse.throwServerError(400);
  }

  const productsCollection = db.collection('products');
  let products;

  if(shortValue) {
    products = await productsCollection
      .find<Product>({ _id: { $in: idsValue }})
      .project<ShortProduct>(shortProductFields)
      .sort({ _id: 1})
      .toArray();
  } else {
    products = await productsCollection
      .find<Product>({ _id: { $in: idsValue }})
      .sort({ _id: 1})
      .toArray();
  }

  return new ServerResponse(200, { products });
});
