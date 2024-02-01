import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import products from "../../products.json";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  APIGatewayProxyResult
> = async (event) => {
  const productId = event?.pathParameters?.id;
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      body: "Product not found",
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};

export const main = middyfy(getProductsById);
