import { Router } from "express";

import { StoreController } from "../controllers/StoreController";

const router = Router();
const controller = new StoreController();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
