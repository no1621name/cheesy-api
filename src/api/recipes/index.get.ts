import db from '@/db';
import shortArticleFields from '@/utils/shortArticleFields';
import ServerResponse from '@/utils/serverResponse';
import useIsNumber from '@/utils/useIsNumber';

export default eventHandler(async (e) => {
  const {
    category = 0,
    limit = 6,
    offset = 0,
    sort = '_id.asc',
  } = getQuery(e);

  const categoryValue = +category;
  const limitValue = +limit;
  const offsetValue = +offset;

  if (!(
    useIsNumber(categoryValue) &&
    useIsNumber(limitValue) &&
    limitValue > 0 &&
    typeof sort === 'string'
  )) { throw ServerResponse.throwServerError(400,'1'); }

  const [sortName, sortValue] = sort.split('.');
  if (
    sortName !== 'date' &&
    sortName !== '_id' &&
    sortValue !== 'asc' &&
    sortValue !== 'desc') { ServerResponse.throwServerError(400); }

  const recipesCollection = db.collection('recipes');

  const findParams: { category_id?: number } = { category_id: categoryValue };

  if (categoryValue === 0) {
    delete findParams.category_id;
  }

  const recipes: ShortArticle[] = await recipesCollection
    .find<Article>(findParams)
    .project<ShortArticle>(shortArticleFields)
    .skip(offsetValue)
    .limit(limitValue)
    .sort(sortName, sortValue)
    .toArray();

  return await new ServerResponse(200, { recipes }).withPagination(recipesCollection, findParams, offsetValue, limitValue);
});
