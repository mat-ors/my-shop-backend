import products from "./products.json";
import dotenv from "dotenv";
import { databaseService } from "./dependencies/dependencies";
dotenv.config();

const productsTable = process.env.TABLE_PRODUCTS;
const stocksTable = process.env.TABLE_STOCKS;

const initTables = async () => {
  products.forEach(async ({ id, title, description, price, count }) => {
    await databaseService.put(productsTable, { id, title, description, price });
    await databaseService.put(stocksTable, { product_id: id, count });
  });
};

initTables();
