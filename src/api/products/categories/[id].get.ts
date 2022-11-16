import checkResponse from '@/utils/checkResponse';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e) => {
  const _id = +e.context.params.id;

  if (!(useIsNumber(_id) && _id > 0)) { throw ServerResponse.throwServerError(400); }

  const categoriesCollection = db.collection('categories');
  const category = await categoriesCollection.findOne<Category>({ _id });
  const parent = await categoriesCollection.findOne({ children_ids: _id});

  checkResponse(category, 'Category not found');

  return new ServerResponse(200, { category, parent });
});
