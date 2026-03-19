import { Router } from "express";

import { UserController } from "../controllers/UserController";
import authMiddleware from "../middleware/authenticate";

const router = Router();
const controller = new UserController();

router.post("/", controller.create);
router.get("/", authMiddleware, controller.list);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
