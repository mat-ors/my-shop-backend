import { config } from "dotenv";
config();

console.log(Buffer.from(`orsolya_matisz:${process.env.orsolya_matisz}`).toString("base64"));
