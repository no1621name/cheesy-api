import db from '@/db';
import shortArticleFields from '@/utils/shortArticleFields';
import ServerResponse from '@/utils/serverResponse';
import useIsNumber from '@/utils/useIsNumber';

export default defineEventHandler(async (e) => {
  const {
    limit = 6,
    offset = 0,
    sort = '_id.asc',
  } = useQuery(e);

  const offsetValue = +offset;
  const limitValue = +limit;

  if (!(
    useIsNumber(limitValue) &&
    limitValue > 0 &&
    typeof sort === 'string')) { throw ServerResponse.throwServerError(400); }

  const [sortName, sortValue] = sort.split('.');
  if (
    sortName !== 'date' &&
    sortName !== '_id' &&
    sortValue !== 'asc' &&
    sortValue !== 'desc') { throw ServerResponse.throwServerError(400); }

  const blogsCollection = db.collection('blogs');

  const blogs = await blogsCollection
    .find<Article>({})
    .project<ShortArticle>(shortArticleFields)
    .limit(limitValue)
    .skip(offsetValue)
    .sort(sortName, sortValue)
    .toArray();

  return await new ServerResponse(200, { blogs }).withPagination(blogsCollection, {}, offsetValue, limitValue);
});
