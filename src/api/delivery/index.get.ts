import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async () => {
  const deliveryCollection = db.collection('delivery');

  const deliveryTypes = await deliveryCollection.find<Delivery>({}).sort({ _id: 1 }).toArray();

  if (!deliveryTypes.length) { ServerResponse.throwServerError(404); }


  return new ServerResponse(200, { deliveryTypes });
});
