import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Orders', () => {
  const baseOrderReqBody = {
    coupon_id: 0,
    products: [
      {
        _id: 1,
        name: 'Душистый перец горошком (100г)',
        price: 320,
        discount: 37.5,
        rating: 0,
        isInStock: true,
        images: [
          'image2',
          'image3'
        ],
        quantityInStock: 988,
        vendor: '000-001',
        views: 15,
        amount: 1
      },
      {
        _id: 2,
        name: 'Мезофильная закваска Danisco',
        price: 1800,
        discount: 20,
        rating: 0,
        isInStock: true,
        images: [
          'image1'
        ],
        quantityInStock: 995,
        vendor: '000-002',
        views: 4,
        amount: 1
      },
      {
        _id: 3,
        name: 'Красный перец молотый (100г)',
        price: 400,
        discount: 10,
        rating: 0,
        isInStock: true,
        images: [
          'image3'
        ],
        quantityInStock: 995,
        vendor: '000-003',
        views: 5,
        amount: 1
      }
    ],
    total: 2299,
    delivery_id: 4,
    deliveryOption_index: 1,
    user_id: 2,
    paymentType_id: 3
  };

  it('Returns orders by user id', async () => {
    const res = await req
      .get('/orders/1')
      .set('x-api-key', apiKey)
      .set('cookie', `token=${process.env.TEST_USER_TOKEN};`)
      .expect(200);

    expect(res.body.data.orders).toBeArray();
    res.body.data.orders.forEach(o => {
      expect(o).toHaveKeys([
        '_id', 'user_id',
        'products', 'total',
        'delivery_id', 'deliveryOption_index',
        'paymentType_id', 'coupon_id'
      ]);

      expect(o.products).toBeArray();
      o.products.forEach(p => expect(p).toHaveKeys([
        '_id', 'name',
        'images', 'price',
        'discount', 'isInStock',
        'rating', 'vendor',
        'quantityInStock', 'views',
        'amount',
      ]));
    });
  });

  it('Successful new order', async () => {
    const res = await req
      .post('/orders')
      .send(baseOrderReqBody)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.message).toEqual('Order successfully registered');
  });

  it('Incorrect new order', async () => {
    await req
      .post('/orders')
      .send({
        ...baseOrderReqBody,
        total: 1
      })
      .set('x-api-key', apiKey)
      .expect(400);

    await req
      .post('/orders')
      .send({
        ...baseOrderReqBody,
        coupon_id: 9999999
      })
      .set('x-api-key', apiKey)
      .expect(400);

    await req
      .post('/orders')
      .send({
        ...baseOrderReqBody,
        coupon_id: -1
      })
      .set('x-api-key', apiKey)
      .expect(400);

    await req
      .post('/orders')
      .send({
        ...baseOrderReqBody,
        products: [{
          _id: 1,
          name: 'Душистый перец горошком (100г)',
          price: 320,
          discount: 37.5,
          rating: 0,
          isInStock: true,
          images: [
            'image2',
            'image3'
          ],
          quantityInStock: 988,
          vendor: '000-001',
          views: 15,
          amount: 1
        }],
        total: 200,
        paymentType_id: 5
      })
      .set('x-api-key', apiKey)
      .expect(400);
  });
});
