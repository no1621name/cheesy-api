import db from '@/db';
import checkResponse from '@/utils/checkResponse';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async () => {
  const brandsCollection = db.collection('brands');
  const brands = await brandsCollection
    .find<Brand>({})
    .collation({ locale: 'en' })
    .sort({ name: 1 })
    .toArray();

  checkResponse(brands, 'Brands not found');

  return new ServerResponse(200, { brands });
});
