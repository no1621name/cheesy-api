import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e) => {
  const user_id = +e.context.params.user;

  if (!useIsNumber(user_id)) { throw ServerResponse.throwServerError(400); }

  const findParams: {user_id?: number} = { user_id };

  if (user_id === 0) {
    delete findParams.user_id;
  }

  const ordersCollection = db.collection('orders');
  const orders = await ordersCollection.find<Order>(findParams).sort({ _id: 1 }).toArray();

  return new ServerResponse(200, { orders });
});
