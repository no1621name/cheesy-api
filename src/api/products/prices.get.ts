import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { type } = useQuery(e);

  if (!(
    type === 'goods' ||
    type === 'set' ||
    type === 'all')) { throw ServerResponse.throwServerError(400); }

  const findParams: { type?: string } = {
    type,
  };

  if (type === 'all') { delete findParams.type; }

  const product = db.collection('products');

  const min = (await product.find<Product>(findParams).sort({ price: 1 }).toArray())[0].price;
  const max = (await product.find<Product>(findParams).sort({ price: -1 }).toArray())[0].price;

  if (!(min && max)) { throw ServerResponse.throwServerError(500); }

  return new ServerResponse(200, { min, max });
});
