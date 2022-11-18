import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async (e) => {
  const _id = +e.context.params.id;

  const salesCollection = db.collection('sales');
  const sale = await salesCollection.findOne<Sale>({ _id });

  if (!sale) { ServerResponse.throwServerError(404); }

  return new ServerResponse(200, { sale });
});
