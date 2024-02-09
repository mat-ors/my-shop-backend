import AWS from "aws-sdk";
import { databaseServiceFactory } from "../db-service";
const region = process.env.AWS_REGION || "us-east-1";
const dynamo = new AWS.DynamoDB.DocumentClient({ region });

export const databaseService = databaseServiceFactory(dynamo);
export const snsClient = new AWS.SNS({ region });
