import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import { CompatibilityEvent } from 'h3';

// TODO: restrictions

export default eventHandler(async (e: CompatibilityEvent) => {
  const { code } = useQuery(e);
  const couponsCollection = db.collection('coupons');

  if(code && !Array.isArray(code)) {
    const coupon = await couponsCollection.findOne<Coupon>({ code });

    if(!coupon || coupon.expires < new Date().toISOString()) {
      ServerResponse.throwServerError(400);
    }

    return new ServerResponse(200, { coupon });
  }

  const coupons = await couponsCollection.find<Coupon>({}).sort({ _id: 1 }).toArray();

  return new ServerResponse(200, { coupons });
});
