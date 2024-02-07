import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { middyfy } from "@libs/lambda";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { IDatabaseService } from "src/db-service";
import { okResponse, errorResponse } from "src/responses";
import { databaseService } from "src/dependencies/dependencies";

const getProductsList =
  (
    databaseService: IDatabaseService
  ): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> =>
  async (event) => {
    try {
      console.log(event);
      const productDocuments = await databaseService.scanProducts();

      const products = await Promise.all(
        productDocuments.map(async (product) => {
          const stockDocument = await databaseService.getStockById(product.id);

          return {
            ...product,
            count: stockDocument.count,
          };
        })
      );

      return okResponse(products);
    } catch (error) {
      console.error("Error:", error);

      return errorResponse("Internal Server Error");
    }
  };

export const main = middyfy(getProductsList(databaseService));
