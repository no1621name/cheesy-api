import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import useQueryToArray from '@/utils/useQueryToArray';
import { CompatibilityEvent } from 'h3';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { ids: idsQ } = useQuery(e);
  const ids = useQueryToArray(idsQ);

  const categoriesCollection = db.collection('categories');

  if (ids[0] >= 0) {
    const categories = await categoriesCollection.find({ _id: { $in: ids } }).toArray();

    return new ServerResponse(200, { categories });
  }

  const bigCategories = await categoriesCollection
    .find({ type: 'bigCategory' })
    .project<Category>({ type: 0 }).sort({ _id: 1 })
    .toArray();

  if (!bigCategories.length) { ServerResponse.throwServerError(500); }

  const categories_ids = bigCategories.flatMap((c: Category) => c.children_ids);
  const categories = await categoriesCollection
    .find<Category>({ _id: { $in: categories_ids } })
    .sort({ _id: 1 })
    .toArray();

  return new ServerResponse(200, { bigCategories, categories });
});
