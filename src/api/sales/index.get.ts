import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async () => {
  const salesCollection = db.collection('sales');
  const sales = await salesCollection.find<Sale>({}).toArray();

  return new ServerResponse(200, { sales });
});
