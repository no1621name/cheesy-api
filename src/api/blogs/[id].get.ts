import checkResponse from '@/utils/checkResponse';
import db from '@/db';
import useIsNumber from '@/utils/useIsNumber';
import ServerResponse from '@/utils/serverResponse';

export default defineEventHandler(async (e) => {
  const _id = Number(e.context.params.id);

  if (!(useIsNumber(_id) && _id > 0)) { throw ServerResponse.throwServerError(400); }

  const blogs = db.collection('blogs');
  const blog = await blogs.findOne<Article>({ _id });

  checkResponse(blog, 'blog not found');

  return new ServerResponse(200, { blog });
});
