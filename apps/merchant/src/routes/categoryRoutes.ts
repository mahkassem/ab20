import { Router } from "express";

import { CategoryController } from "../controllers/CategoryController";
import authMiddleware from "../middleware/authenticate";

const router = Router();
const controller = new CategoryController();

router.post("/", authMiddleware, controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
