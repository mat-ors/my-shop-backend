import { Handler, S3Event } from "aws-lambda";
import * as AWS from "aws-sdk";
import csv from "csv-parser";
import { s3Client } from "src/dependencies/dependencies";

export const importFileParser =
  (s3: AWS.S3): Handler<S3Event> =>
  (event) => {
    try {
      const record = event.Records[0];
      const fileName = decodeURIComponent(record.s3.object.key).split("/")[1];
      const bucket = process.env.IMPORT_BUCKET;

      const params = {
        Bucket: bucket,
        Key: `uploaded/${fileName}`,
      };

      const chunks = [];

      const s3Stream = s3.getObject(params).createReadStream();

      s3Stream
        .pipe(csv())
        .on("error", (err) => console.log(err))
        .on("data", (data) => chunks.push(data))
        .on("end", async () => {
          console.log(chunks);

          try {
            const { Body } = await s3.getObject(params).promise();

            await s3
              .putObject(
                {
                  Bucket: bucket,
                  Key: `parsed/${fileName}`,
                  Body,
                },
                async (err) => {
                  if (!err) {
                    await s3
                      .deleteObject({
                        Bucket: bucket,
                        Key: `uploaded/${fileName}`,
                      })
                      .promise();
                  }
                }
              )
              .promise();
          } catch (err) {
            console.log(err);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

export const main = importFileParser(s3Client);
