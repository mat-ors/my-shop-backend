import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        responses: {
          default: {},
          200: {
            description: "Request successful!",
            bodyType: "Products",
          },
          500: {
            description: "Internal Server Error",
            bodyType: "InternalServerError",
          },
        },
      },
    },
  ],
};
