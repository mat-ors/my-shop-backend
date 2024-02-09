import { Handler, SQSEvent } from "aws-lambda";
import { IDatabaseService } from "src/db-service";
import { databaseService, snsClient } from "src/dependencies/dependencies";
import { Product } from "src/types/types";

export const catalogBatchProcess =
  (databaseService: IDatabaseService, snsClient: AWS.SNS): Handler<SQSEvent> =>
  async (event) => {
    const productNames: string[] = [];

    await Promise.all(
      event.Records.map((sqsMessage) => {
        const product: Product = JSON.parse(sqsMessage.body);
        productNames.push(product.title);

        return databaseService.createProduct(product);
      })
    );

    await snsClient
      .publish({
        Subject: "New product uploaded!",
        TopicArn: process.env.TOPIC_ARN,
        Message: JSON.stringify(productNames),
      })
      .promise();

    return "Done!";
  };

export const main = catalogBatchProcess(databaseService, snsClient);
