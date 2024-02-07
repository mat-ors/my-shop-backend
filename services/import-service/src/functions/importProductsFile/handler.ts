import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { badRequestResponse, errorResponse, okResponse } from "src/responses";
import { s3Client } from "src/dependencies/dependencies";

const importProductsFile =
  (s3Client: AWS.S3): ValidatedEventAPIGatewayProxyEvent<typeof schema> =>
  async (event) => {
    try {
      const { name } = event.queryStringParameters;

      if (!name) {
        return badRequestResponse('Missing queryParameter: "name"');
      }

      const signedUrl = await s3Client.getSignedUrlPromise("putObject", {
        Bucket: process.env.IMPORT_BUCKET,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: "text/csv",
      });

      return okResponse(signedUrl);
    } catch (err) {
      console.log(err);

      return errorResponse("Something went wrong");
    }
  };

export const main = middyfy(importProductsFile(s3Client));
