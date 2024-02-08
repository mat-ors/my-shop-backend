import { Handler, S3Event } from "aws-lambda";
import csv from "csv-parser";
import { s3Client, sqsClient } from "src/dependencies/dependencies";

export const importFileParser =
  (s3: AWS.S3, sqs: AWS.SQS): Handler<S3Event> =>
  (event, context, callback) => {
    try {
      const chunks = [];
      const fileName = decodeURIComponent(event.Records[0].s3.object.key).split(
        "/"
      )[1];
      const bucket = process.env.IMPORT_BUCKET;
      const s3Params = {
        Bucket: bucket,
        Key: `uploaded/${fileName}`,
      };

      s3.getObject(s3Params)
        .createReadStream()
        .pipe(csv())
        .on("error", (err) => console.log(err))
        .on("data", (data) => chunks.push(data))
        .on("end", async () => {

          await Promise.all(
            chunks.map((chunk) =>
              sqs
                .sendMessage({
                  QueueUrl: process.env.CATALOG_ITEMS_QUEUE_URL,
                  MessageBody: JSON.stringify(chunk),
                })
                .promise()
            )
          );

          const { Body } = await s3.getObject(s3Params).promise();
          console.log("Copy object to parsed directory...");

          await s3
            .putObject(
              {
                Bucket: bucket,
                Key: `parsed/${fileName}`,
                Body,
              },
              async (err) => {
                if (!err) {
                  console.log("Delete file from uploaded directory...");

                  await s3
                    .deleteObject({
                      Bucket: bucket,
                      Key: `uploaded/${fileName}`,
                    })
                    .promise();

                  callback(null, "Csv processing successful!");
                }
              }
            )
            .promise();
        });
    } catch (err) {
      console.log(err);

      callback("Sorry! Error during processing csv.");
    }
  };

export const main = importFileParser(s3Client, sqsClient);
