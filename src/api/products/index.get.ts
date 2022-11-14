import { CompatibilityEvent } from 'h3';
import { SortDirection } from 'mongodb';
import db from '@/db';
import shortProductFields from '@/utils/shortProductFields';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';
import useQueryToArray from '@/utils/useQueryToArray';

export default eventHandler(async (e: CompatibilityEvent) => {
  const {
    type = 'goods',
    sort = '_id.asc',
    limit = 8,
    offset = 0,
    discount = 0,
    isInStock = 0,
    category = 1,
    brand = 0,
    priceFrom = 0,
    priceTo = 9999,
    search_q = '',
    ids = [],
    short = 0,
  } = useQuery(e);

  if (!(
    type === 'goods' ||
    type === 'set' ||
    type === 'all')) { throw ServerResponse.throwServerError(400); }

  const productsCollection = db.collection('products');
  const offsetValue = +offset;
  const limitValue = +limit;
  const discountValue = +discount;
  const isInStockValue =  +isInStock;
  const priceFromValue = +priceFrom;
  const priceToValue = +priceTo;

  const idsValue = useQueryToArray(ids);

  const categoryValue = useQueryToArray(category);
  const brandValue = useQueryToArray(brand);

  const isValidCategories = categoryValue
    .every((category_id: number) =>  useIsNumber(category_id) && category_id !== 0);

  const isValidNmbers = [
    limitValue,
    offsetValue,
    discountValue,
    priceFromValue,
    priceToValue,
    isInStockValue,
  ]
    .every((value: number) => useIsNumber(value));

  if (!(
    isValidNmbers &&
    isValidCategories &&
    limitValue > 0 &&
    typeof sort === 'string')) { throw ServerResponse.throwServerError(400); }

  const [sortName, sortValue] = sort.split('.');
  if (
    sortName !== 'views' &&
    sortName !== 'price' &&
    sortName !== '_id' &&
    sortValue !== 'asc' &&
    sortValue !== 'desc') { throw ServerResponse.throwServerError(400); }


  if(idsValue.length) {
    const shortValue = +short;

    const isValidIds = idsValue
      .every((id: number) =>  useIsNumber(id) && id !== 0);

    if(!isValidIds || !useIsNumber(shortValue)) {
      ServerResponse.throwServerError(400);
    }

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

    return new ServerResponse(200, { products }).withPagination(productsCollection, { ids }, offsetValue, limitValue);
  }

  const findParams: any = search_q && typeof search_q === 'string'
    ?  {
        type: 'goods',
        $or: [
          { name: { $regex: search_q, $options: '$i' } },
          { vendor: { $regex: search_q } }
        ]
      }
    : {
        type,
        price: { $gte: priceFromValue, $lte: priceToValue },
        discount: { [discountValue ? '$gt' : '$gte']: 0 },
        $or: [{ isInStock: isInStockValue > 0 }, { isInStock: true }],
        brand_id: brandValue.length && brandValue[0] > 0 ? { $in: brandValue } : { $gt: 0 },
      };

  if (type === 'goods') {
    findParams.categories = { $in: categoryValue };
  } else if (type === 'all') {
    delete findParams.brand_id;
    delete findParams.type;
  } else if (type === 'set') {
    delete findParams.brand_id;
  }

  const products = await productsCollection
    .find<Product>(findParams)
    .project<ShortProduct>(shortProductFields)
    .sort(sortName, sortValue as SortDirection)
    .skip(offsetValue)
    .limit(limitValue)
    .toArray();


  return await new ServerResponse(200, { products }).withPagination(productsCollection, findParams, offsetValue, limitValue);
});
