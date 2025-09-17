import { Router } from "express";

import { IfscController } from "../controllers/ifsc_controller.js";

export const getIfscRouter = (): Router => {
  const router = Router();

  router.get("/:ifsc", IfscController.getIfscDetails);

  return router;
};
