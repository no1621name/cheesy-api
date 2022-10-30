import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import useQueryToArray from '@/utils/useQueryToArray';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { parents_ids: parents_idsQ } = useQuery(e);
  const parents_ids = useQueryToArray(parents_idsQ);

  const categoriesCollection = db.collection('categories');
  const findParams: { type: null, _id?: {$in: number[]}} = { type: null };

  if(parents_ids[0]) {
    const parentCategories = await categoriesCollection.find<Category>({ _id: { $in: parents_ids }}).toArray();
    findParams._id = { $in: parentCategories.flatMap(c => c.children_ids)};
  }

  const subCategories = await categoriesCollection.find(findParams).toArray();

  return new ServerResponse(200, { subCategories });
});
