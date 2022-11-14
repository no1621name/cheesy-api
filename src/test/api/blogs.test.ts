import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Blogs', () => {
  it('Returns blogs list', async () => {
    const res = await req
      .get('/blogs')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.blogs).toBeArray();
    res.body.data.blogs.forEach(b => expect(b).toHaveKeys([
      '_id', 'title', 'date', 'preview', 'description'
    ]));
  });

  it('Blogs list limited', async () => {
    const res = await req
      .get('/blogs')
      .query({limit: 7})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.blogs.length).toEqual(7);
  });

  it('Offset works', async () => {
    const res = await req
      .get('/blogs')
      .query({offset: 6})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.blogs[0]._id).toEqual(7);
  });

  it('Blogs list has pagination', async () => {
    const res = await req
      .get('/blogs')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data).toHavePagination();
  });

  it('Blogs list sorted by _id (desc)', async () => {
    const res = await req
      .get('/blogs')
      .query({sort: '_id.desc'})
      .set('x-api-key', apiKey)
      .expect(200);

      expect(res.body.data.blogs).toBeSortedBy('_id', 'desc', res.body.data.blogs[0]._id);
  });

  it('Blogs list sorted by date', async () => {
    const resDesc = await req
      .get('/blogs')
      .query({sort: 'date.desc'})
      .set('x-api-key', apiKey)
      .expect(200);

    const resAsc = await req
      .get('/blogs')
      .query({sort: 'date.asc'})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(resDesc.body.data.blogs).toBeSortedBy('date', 'desc', resDesc.body.data.blogs[0].date);
    expect(resAsc.body.data.blogs).toBeSortedBy('date', 'asc', resAsc.body.data.blogs[0].date);
  });

  it('Returns blog by id', async () => {
    const blogId = 1;
    const res = await req
      .get(`/blogs/${blogId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.blog).toHaveKeys([
      '_id',
      'title',
      'date',
      'preview',
      'description',
      'content',
      'images',
      'numberedLists',
      'productLists',
      'accordions'
    ]);

    const { accordions, images, numberedLists, productLists } = res.body.data.blog;
    [accordions,images,numberedLists,productLists].forEach((v) => {
      expect(v).toBeArray();
    });

    productLists.forEach((l) => {
      expect(l).toHaveKeys(['title', 'products']);
      expect(l.products).toBeArray();

      l.products.forEach((p) => {
        expect(p).toHaveKeys(['name', 'category_id']);
      });
    });

    expect(res.body.data.blog._id).toEqual(blogId);
  });

  it('Blog by id is not found', async () => {
    await req
      .get('/blogs/9999999')
      .set('x-api-key', apiKey)
      .expect(404);
  });
});
