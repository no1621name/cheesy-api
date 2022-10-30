import { CompatibilityEvent } from 'h3';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const _id = +e.context.params.id;

  if (!useIsNumber(_id)) { throw ServerResponse.throwServerError(400); }

  const couponsCollection = db.collection('coupons');

  const coupon = await couponsCollection.findOne<PaymentType>({ _id });

  if (!coupon) { ServerResponse.throwServerError(404); }

  return new ServerResponse(200, { coupon });
});
