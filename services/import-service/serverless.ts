import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      IMPORT_BUCKET: "my-shop-import-service",
      CATALOG_ITEMS_QUEUE_URL: 'https://sqs.us-east-1.amazonaws.com/767397666326/catalogItemsQueue',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "s3:*",
            Resource: ["arn:aws:s3:::my-shop-import-service"],
          },
          {
            Effect: "Allow",
            Action: "s3:*",
            Resource: ["arn:aws:s3:::my-shop-import-service/*"],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
