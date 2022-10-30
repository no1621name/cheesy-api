import { CompatibilityEvent } from 'h3';
import db from '@/db';
import checkResponse from '@/utils/checkResponse';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { subject } = useQuery(e);
  const subject_id = Number(subject);

  const citiesCollection = db.collection('cities');

  const cities = await citiesCollection
      .find<City>({
        subject_id: (subject && useIsNumber(subject_id)) ? subject_id : { $gte: 0 }
      })
      .sort({ _id: 1 })
      .toArray();

  checkResponse(cities, 'Cities not found');

  return new ServerResponse(200, { cities });
});
