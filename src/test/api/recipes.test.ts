import { req, apiKey } from '@t/appInfo';
import '@t/matchers';

describe('Recipes', () => {
  it('Returns recipes list', async () => {
    const res = await req
      .get('/recipes')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipes).toBeArray();
    res.body.data.recipes.forEach(r => expect(r).toHaveKeys([
      '_id', 'date',
      'description', 'preview',
      'title', 'category_id'
    ]));
  });

  it('Recipes list by category id', async () => {
    const category = 1;
    const res = await req
      .get('/recipes')
      .set('x-api-key', apiKey)
      .query({ category })
      .expect(200);

    res.body.data.recipes.forEach(r => expect(r.category_id).toEqual(category));
  });

  it('Recipes list sorted by date', async () => {
    const resDesc = await req
      .get('/recipes')
      .set('x-api-key', apiKey)
      .query({ sort: 'date.desc' })
      .expect(200);

    const resAsc = await req
      .get('/recipes')
      .query({sort: 'date.asc'})
      .set('x-api-key', apiKey)
      .expect(200);


    expect(resDesc.body.data.recipes).toBeSortedBy('date', 'desc', resDesc.body.data.recipes[0].date);
    expect(resAsc.body.data.recipes).toBeSortedBy('date', 'asc', resAsc.body.data.recipes[0].date);
  });

  it('Recipes list sorted by id (desc)', async () => {
    const res = await req
      .get('/recipes')
      .query({sort: '_id.desc'})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipes).toBeSortedBy('_id', 'desc', res.body.data.recipes[0]._id);
  });

  it('Recipes list has pagination', async () => {
    const res = await req
      .get('/recipes')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data).toHavePagination();
  });

  it('Recipes list limited', async () => {
    const res = await req
      .get('/recipes')
      .query({limit: 7})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipes.length).toEqual(7);
  });

  it('Offset works', async () => {
    const res = await req
      .get('/recipes')
      .query({offset: 6})
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipes[0]._id).toEqual(7);
  });

  it('Returns recipe by id', async () => {
    const recipeId = 1;
    const res = await req
      .get(`/recipes/${recipeId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipe).toHaveKeys([
      '_id',
      'title',
      'date',
      'preview',
      'description',
      'content',
      'images',
      'numberedLists',
      'productLists',
      'accordions',
      'category_id'
    ]);

    const { accordions, images, numberedLists, productLists } = res.body.data.recipe;
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

    expect(res.body.data.recipe._id).toEqual(recipeId);
  });

  it('Recipe by id is not found', async () => {
    await req
      .get('/recipes/9999999999')
      .set('x-api-key', apiKey)
      .expect(404);
  });

  it('Returns recipes categories list', async () => {
    const res = await req
      .get('/recipes/categories')
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.categories).toBeArray();
    res.body.data.categories.forEach(r => expect(r).toHaveKeys([
      '_id', 'name', 'preview'
    ]));
  });

  it('Recipe category by id', async () => {
    const recipeCategoryId = 1;
    const res = await req
      .get(`/recipes/categories/${recipeCategoryId}`)
      .set('x-api-key', apiKey)
      .expect(200);

    expect(res.body.data.recipeCategory).toHaveKeys([
      '_id', 'name', 'preview'
    ]);
    expect(res.body.data.recipeCategory._id).toEqual(recipeCategoryId);
  });

  it('Recipe category by id is not found', async () => {
    await req
      .get('/recipes/categories/9999999999')
      .set('x-api-key', apiKey)
      .expect(404);
  });

  it('Recipe category incorrect id', async () => {
    await req
      .get('/recipes/categories/0')
      .set('x-api-key', apiKey)
      .expect(400);

    await req
      .get('/recipes/categories/asdfasdf')
      .set('x-api-key', apiKey)
      .expect(400);
  });
});
