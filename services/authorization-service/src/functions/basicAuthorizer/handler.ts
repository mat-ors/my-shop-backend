import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";
enum Effect {
  Allow = "Allow",
  Deny = "Deny",
}
const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const { authorizationToken, methodArn } = event;
  const principalId = "test";

  const authMethod = authorizationToken.split(" ")[0];
  const decodedToken = Buffer.from(
    authorizationToken.split(" ")[1],
    "base64"
  ).toString("ascii");
  const checkAuthentication =
    authMethod === "Basic" && decodedToken === `orsolya_matisz:${process.env.orsolya_matisz}`;

  const response = checkAuthentication
    ? generateResponse(principalId, Effect.Allow, methodArn)
    : generateResponse(principalId, Effect.Deny, methodArn);

  return response;
};

function generateResponse(
  principalId: string,
  effect: Effect,
  methodArn: string
) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: methodArn,
        },
      ],
    } as PolicyDocument,
  };
}

export const main = basicAuthorizer;
