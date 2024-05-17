import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import express from "express";
import "./controllers";
import mongoose from "mongoose";
import container from "./inversify config/inversify.config";

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Database Connected Successfully!!"))
  .catch((err) => console.log(err));

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
});

const app = server.build();
app.listen(process.env.PORT, () =>
  console.log(`Server is connected on ${process.env.PORT}!!`),
);
