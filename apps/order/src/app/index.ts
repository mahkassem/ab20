import express from "express";

import { errorHandler } from "./errorHandler";
import orderRoutes from "../routes/orderRoutes";
import productRoutes from "../routes/productRoutes";
import userRoutes from "../routes/userRoutes";
import authMiddleware from "../middleware/authenticate";
import dotenv from "dotenv";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/products", productRoutes);
  app.use("/users", userRoutes);
  app.use("/orders", orderRoutes);

  app.use(errorHandler);

  return app;
}
