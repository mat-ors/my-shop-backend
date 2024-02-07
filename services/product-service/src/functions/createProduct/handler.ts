import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { middyfy } from "@libs/lambda";
import { type ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { IDatabaseService } from "src/db-service";
import { databaseService } from "src/dependencies/dependencies";
import { Product } from "src/types/types";
import { createdResponse, errorResponse } from "src/responses";

const createProduct =
  (
    databaseService: IDatabaseService
  ): ValidatedEventAPIGatewayProxyEvent<APIGatewayProxyResult> =>
  async (event) => {
    console.log(event);

    try {
      const res = await databaseService.createProduct(event.body as Product);

      console.log(res);
    } catch (error) {
      console.log(error);

      return errorResponse("Unable to create product");
    }

    return createdResponse();
  };

export const main = middyfy(createProduct(databaseService));
