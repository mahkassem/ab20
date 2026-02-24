import express from "express";

import { errorHandler } from "./errorHandler";
import categoryRoutes from "../routes/categoryRoutes";
import storeRoutes from "../routes/storeRoutes";
import userRoutes from "../routes/userRoutes";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/users", userRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/stores", storeRoutes);

  app.use(errorHandler);

  return app;
}
