import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { middyfy } from "@libs/lambda";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { IDatabaseService } from "src/db-service";
import { notFoundResponse, okResponse } from "src/responses";
import { databaseService } from "src/dependencies/dependencies";

const getProductsById =
  (
    databaseService: IDatabaseService
  ): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> =>
  async (event) => {
    console.log(event);

    const productId = event?.pathParameters?.id;
    const productDocument = await databaseService.getProductById(productId);

    if (!productDocument) {
      return notFoundResponse("Product not found");
    }

    const stockDocument = await databaseService.getStockById(productId);

    const product = {
      ...productDocument,
      count: stockDocument.count,
    };

    return okResponse(product);
  };

export const main = middyfy(getProductsById(databaseService));
