import { Router } from "express";

import {
  searchCie10,
  getCie10ById,
} from "./cie10.controller.js";

const router = Router();

router.get("/buscar", searchCie10);
router.get("/:id", getCie10ById);

export default router;