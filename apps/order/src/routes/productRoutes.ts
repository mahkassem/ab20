import { Router } from "express";

import { ProductController } from "../controllers/ProductController";

const router = Router();
const controller = new ProductController();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
