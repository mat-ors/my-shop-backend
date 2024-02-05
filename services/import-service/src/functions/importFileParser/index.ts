import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "my-shop-import-service",
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [{ prefix: "uploaded/" }],
      },
    },
  ],
};
