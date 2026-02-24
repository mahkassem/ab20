import { Router } from "express";

import { CategoryController } from "../controllers/CategoryController";

const router = Router();
const controller = new CategoryController();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
