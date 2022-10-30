import { CompatibilityEvent } from 'h3';
import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import setToken from '@/utils/setToken';

export default eventHandler(async (e: CompatibilityEvent) => {
  const { email, fullname, password } = await useBody<{ email: string, fullname: string, password: string }>(e);

  if (!(email && fullname && password)) { ServerResponse.throwServerError(400); }

  const users = db.collection('users');

  const usetExists = await users.findOne({ email });

  if (usetExists) { ServerResponse.throwServerError(400, 'Already exists'); }

  const lastId = (await users.find().project({ _id: 1 }).sort({ _id: -1 }).toArray())[0]._id;
  const _id = lastId + 1;

  const response = await users.insertOne({
    _id,
    fullname,
    email,
    phoneNumber: '',
    password,
    cart: [],
    favourites: [],
    viewed: [],
    coupons: [],
    address: {
      country: 'Россия',
      country_id: 1,
      city: 'Москва',
      city_id: 1,
      postcode: 0,
      subject_id: 1,
      subject: 'Московская область',
      street: '',
      house: 0,
      apartment: 0
    },
    role: 'user'
  });

  if (response.acknowledged) {
    await setToken(e, { _id, role: 'user' });
    return new ServerResponse(200, { message: 'Successful registration', });
  } else {
    ServerResponse.throwServerError(500);
  }
});
