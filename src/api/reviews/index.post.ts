import db from '@/db';
import ServerResponse from '@/utils/serverResponse';
import { uploadMany } from '@/utils/cloudinary';
import useIsNumber from '@/utils/useIsNumber';

export default eventHandler(async (e) => {
  const request = await readBody<ReviewRequest>(e);

  for (const field in request) {
    const value = request[field as keyof ReviewRequest];

    if (!value && value !== 0) { ServerResponse.throwServerError(400, `${value}`); }

    if (field === 'images') {
      if(typeof value !== 'object'){
        ServerResponse.throwServerError(400);
      }
    } else if (field === 'score') {
      if (value <= 0 || value > 5){
        ServerResponse.throwServerError(400);
      }
    } else if (field !== 'product_id' && typeof value !== 'string') {
      ServerResponse.throwServerError(400);
    }
  }

  const uploadedImages = await uploadMany(request.images);

  const reviewsCollection = db.collection('reviews');

  const lastId = (await reviewsCollection.find<Review>({}).project({ _id: 1 }).sort({ _id: -1 }).toArray())[0]._id;
  const _id = lastId + 1;

  const responseData: { message: string, rating?: number } = { message: 'Review successfully added' };

  if(useIsNumber(request.product_id) && request.product_id > 0) {
    const productsCollection = db.collection('products');
    await productsCollection.updateOne({ _id: request.product_id }, { $push: { reviews_ids: _id } });
    const product = await productsCollection.findOne<Product>({_id: request.product_id});

    const reviews = await reviewsCollection.find<Review>({product_id: product._id}).toArray();

    const reviewsMiddle = reviews.reduce((prev: number, curr: Review) => {
      return prev += curr.score;
    }, 0);

    const rating = +(reviewsMiddle / reviews.length).toFixed(2);

    const scoreRequest = await productsCollection.updateOne({ _id: request.product_id }, { $set: { rating } });

    if(scoreRequest.acknowledged) {
      responseData.rating = rating;
    } else {
      throw ServerResponse.throwServerError(500);
    }
  } else {
    request.product_id = 0;
  }

  const response = await reviewsCollection.insertOne({
    _id,
    images: uploadedImages,
    fullname: request.fullname,
    score: request.score,
    text: request.text,
    city: request.city,
    date: new Date().toISOString(),
  });


  if (response.acknowledged) {
    return new ServerResponse(201, responseData);
  } else {
    ServerResponse.throwServerError(500);
  }
});
