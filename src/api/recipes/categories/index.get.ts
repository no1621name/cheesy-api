import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async () => {
  const recipesCategories = db.collection('recipesCategories');
  const categories = await recipesCategories.find<RecipeCategory>({}).sort({ _id: 1 }).toArray();

  if (!categories.length) { ServerResponse.throwServerError(500); }

  return new ServerResponse(200, { categories });
});
