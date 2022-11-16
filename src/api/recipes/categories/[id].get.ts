import checkResponse from '@/utils/checkResponse';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e) => {
  const _id = +e.context.params.id;

  if (!(useIsNumber(_id) && _id > 0)) { throw ServerResponse.throwServerError(400); }

  const recipesCategories = db.collection('recipesCategories');
  const recipeCategory = await recipesCategories.findOne({ _id });

  checkResponse(recipeCategory, 'Recipe category not found');

  return new ServerResponse(200, { recipeCategory });
});
