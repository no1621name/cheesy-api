import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async () => {
  const paymentCollection = db.collection('payment');

  const paymentTypes = await paymentCollection.find<PaymentType>({}).sort({ _id: 1 }).toArray();

  if (!paymentTypes.length) { ServerResponse.throwServerError(404); }

  return new ServerResponse(200, { paymentTypes });
});
