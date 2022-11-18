import checkResponse from '@/utils/checkResponse';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async (e) => {
  const _id = +e.context.params.id;

  if (!(useIsNumber(_id) && _id > 0)) { throw ServerResponse.throwServerError(400); }

  const recipes = db.collection('recipes');
  const recipe = await recipes.findOne<Article>({ _id });

  checkResponse(recipe, 'Recipe not found');

  return new ServerResponse(200, { recipe });
});
