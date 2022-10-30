import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true
});

export const uploadMany = async (images: string[]) => {
  const uploadedImages: string[] = [];

  for (const uri of images) {
    const uploadedImg = await cloudinary.uploader.upload(uri, {
      folder: '/shop/reviews',
      unique_filename: true,
      overwrite: false,
      use_filename: true,
    });

    const publicIdPath = uploadedImg.public_id.split('/');

    uploadedImages.push(publicIdPath[publicIdPath.length-1]);
  }

  return uploadedImages;
};
