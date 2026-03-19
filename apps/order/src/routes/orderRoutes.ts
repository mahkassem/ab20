import { Router } from "express";

import { OrderController } from "../controllers/OrderController";

const router = Router();
const controller = new OrderController();

router.post("/", controller.create);
router.get("/", controller.list);
router.delete("/", controller.deleteAll);
router.get("/:id", controller.getById);

export default router;
