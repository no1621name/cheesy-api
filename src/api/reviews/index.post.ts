import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import { uploadMany } from '@/utils/cloudinary';
import useIsNumber from '@/utils/useIsNumber';

export default defineEventHandler(async (e) => {
  const request = await useBody<ReviewRequest>(e);

  for (const field in request) {
    const value = request[field as keyof ReviewRequest];

    if (!value && value !== 0) { ServerResponse.throwServerError(400, `${value}`); }

    if (field === 'images') {
      if(typeof value !== 'object'){
        ServerResponse.throwServerError(400, '1');
      }
    } else if (field === 'score') {
      if (value <= 0 || value > 5){
        ServerResponse.throwServerError(400, '2');
      }
    } else if ((field !== 'product_id' && field !== 'user_id') && typeof value !== 'string') {
      ServerResponse.throwServerError(400, '3');
    }
  }

  const uploadedImages = await uploadMany(request.images);

  const reviewsCollection = db.collection('reviews');
  const reviewIsExists = await reviewsCollection.findOne({
    user_id: request.user_id,
    product_id: request.product_id
  });

  if(reviewIsExists) {
    return ServerResponse.throwServerError(400, 'Review already exists');
  }

  const { score, text, city, fullname, user_id } = request;
  let { product_id } = request;

  const lastId = (await reviewsCollection.find<Review>({}).project({ _id: 1 }).sort({ _id: -1 }).toArray())[0]._id;
  const _id = lastId + 1;

  const responseData: { message: string, rating?: number } = { message: 'Review successfully added' };

  if(useIsNumber(product_id) && product_id > 0) {
    const productsCollection = db.collection('products');
    await productsCollection.updateOne({ _id: product_id }, { $push: { reviews_ids: _id } });
    const product = await productsCollection.findOne<Product>({_id: product_id});

    const reviews = await reviewsCollection.find<Review>({product_id: product._id}).toArray();

    const reviewsMiddle = reviews.reduce((prev: number, curr: Review) => {
      return prev += curr.score;
    }, 0);

    const rating = +(reviewsMiddle / reviews.length).toFixed(2);

    const scoreRequest = await productsCollection.updateOne({ _id: product_id }, { $set: { rating } });

    if(scoreRequest.acknowledged) {
      responseData.rating = rating;
    } else {
      throw ServerResponse.throwServerError(500);
    }
  } else {
    product_id = 0;
  }

  const response = await reviewsCollection.insertOne({
    _id,
    images: uploadedImages,
    fullname,
    score,
    text,
    city,
    user_id,
    product_id,
    date: new Date().toISOString(),
  });

  if (response.acknowledged) {
    return new ServerResponse(201, responseData);
  } else {
    ServerResponse.throwServerError(500);
  }
});
