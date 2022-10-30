import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { subject = 1 } = useQuery(e);

  if (!subject || Array.isArray(subject)) { throw ServerResponse.throwServerError(400); }

  const deliveryCollection = db.collection('delivery');

  const priceList = await deliveryCollection
    .find({
      priceList: { $elemMatch: { subjects_ids: +subject } }
    })
    .project<Delivery>({
      name: 1,
      logo: 1,
      priceList: { $elemMatch: { subjects_ids: +subject } }
    })
    .sort({
      _id: 1,
    })
    .toArray();

  if (!priceList.length) { ServerResponse.throwServerError(404); }

  return new ServerResponse(200, { priceList });
});
