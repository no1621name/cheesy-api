import { CompatibilityEvent } from 'h3';
import db from '@/db';
import calculateCostOfCart from '@/utils/calculateCostOfCart';
import ServerResponse from '@/utils/serverResponse';

export default eventHandler(async (e: CompatibilityEvent) => {
  const request = await useBody<OrderRequet>(e);

  for (const field in request) {
    const value = request[field as keyof OrderRequet];

    if (value < 0 || (Array.isArray(value) && !value.length)) { throw ServerResponse.throwServerError(400, '1'); }

    if (field === 'products') {
      if (typeof value !== 'object')  {
        throw ServerResponse.throwServerError(400, '2');
      }
    }else if (typeof value !== 'number' || value < 0) {
      throw ServerResponse.throwServerError(400, '32');
    }
  }

  const deliveryCollection = db.collection('delivery');
  const deliveryType = await deliveryCollection.findOne<Delivery>({ _id: request.delivery_id });

  let couponValue = 0;

  if (request.coupon_id < 0) { throw ServerResponse.throwServerError(400, '4'); }
  else if(request.coupon_id > 0) {
    await $fetch<IServerResponse<'coupon', Coupon>>(`/api/coupons/${request.coupon_id}`, {
      headers: {
        'x-api-key': e.req.headers['x-api-key'] as string,
      },
      async onResponse({ response }) {
        if(response.ok) {
          couponValue = response._data.data.coupon.discountValue;
        }
      },
    });
  }

  const totalCost: number = calculateCostOfCart(request.products as WithAmount<ShortProduct>[], couponValue) +
    deliveryType.priceList[request.deliveryOption_index].value;

  if (request.total !== totalCost) { throw ServerResponse.throwServerError(400, '5'); }

  if (request.paymentType_id === 5 && request.total < 2000) { throw ServerResponse.throwServerError(400, '6'); }

  const products = db.collection('products');
  request.products.forEach(async ({ _id }) => {
    await products.updateOne({ _id: _id}, { $inc: { quantityInStock: -1 }});
  });

  const usersCollection = db.collection('users');
  await usersCollection.updateOne({ _id: request.user_id }, { $set: {cart: []}});

  const orders = db.collection('orders');
  const lastOrder = (await orders.find().project({ _id: 1 }).sort({ _id: -1 }).toArray())[0];
  const _id = (lastOrder ? lastOrder._id : 0) + 1;

  const response = await orders.insertOne({ _id, ...request });

  if (response.acknowledged) {
    return new ServerResponse(200, { message: 'Order successfully registered' });
  } else {
    ServerResponse.throwServerError(500);
  }
});
