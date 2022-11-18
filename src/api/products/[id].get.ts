import shortProductFields from '@/utils/shortProductFields';
import db from '@/db';
import checkResponse from '@/utils/checkResponse';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async (e) => {
  const { short = 0 } = useQuery(e);
  const _id = +e.context.params.id;

  if (!useIsNumber(_id)) { throw ServerResponse.throwServerError(400); }

  const products = db.collection('products');

  await products.updateOne({ _id }, { $inc: { views: 1 }});

  let product: Product | ShortProduct | null;
  if (+short) {
    product = (await products
      .find<Product>({ _id })
      .project<ShortProduct>(shortProductFields)
      .toArray())[0];
  } else {
    product = await products.findOne<Product>({ _id });
  }

  checkResponse(product, 'Procduct not found');

  return new ServerResponse(200, { product });
});
