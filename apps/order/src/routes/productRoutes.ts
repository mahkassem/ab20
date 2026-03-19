import { Router } from "express";

import { ProductController } from "../controllers/ProductController";
import authMiddleware from "../middleware/authenticate";

const router = Router();
const controller = new ProductController();

router.post("/", authMiddleware, controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
