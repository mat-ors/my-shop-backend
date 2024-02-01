import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        responses: {
          default: {},
          200: {
            description: 'Request successful!',
            bodyType: 'Product'
          },
          404: {
            description: 'Product not found',
            bodyType: 'ProductNotFound'
          }
        }
      },
    },
  ],
};