import { createLogic } from '@bemedev/fsf';

type Context = {
  apiKey?: string;
  apiUrl?: string;
  url?: string;
};

type Events = { products?: string[]; categories?: string[] };
type Data = string;

export const config1 = createLogic(
  {
    initial: 'preferences',
    data: 'query',
    states: {
      preferences: {
        always: {
          actions: ['setUrl', 'setApiKey', 'startUrl'],
          target: 'categories',
        },
      },
      categories: {
        always: [
          {
            cond: 'hasCategories',
            target: 'products',
            actions: 'setCategories',
          },
          'products',
        ],
      },
      products: {
        always: [
          {
            cond: 'hasProducts',
            target: 'final',
            actions: 'setProducts',
          },
          'final',
        ],
      },
      final: {
        data: 'query',
      },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    setApiKey: ctx => {
      ctx.apiKey = '123';
    },
    setUrl: ctx => {
      ctx.apiUrl = 'https://example.com';
    },
    startUrl: ctx => {
      const { apiUrl, apiKey } = ctx;
      ctx.url = `${apiUrl}?apikey=${apiKey}`;
    },
    setCategories: (ctx, { categories }) => {
      const _categories = categories?.join(',');
      ctx.url += `&categories=${_categories}`;
    },
    setProducts: (ctx, { products }) => {
      const _products = products?.join(',');
      ctx.url += `&products=${_products}`;
    },
  },
  guards: {
    hasCategories: (_, { categories }) =>
      !!categories && categories.length > 0,
    hasProducts: (_, { products }) => !!products && products.length > 0,
  },
  datas: {
    query: ctx => ctx.url ?? '',
  },
});
