import { Router } from "express";

import {
  getMedicamentos,
  getMedicamentoById,
  getMedicamentosStockBajo,
  searchMedicamentos,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
} from "./medicamentos.controller.js";

const router = Router();

router.get("/", getMedicamentos);
router.get("/buscar", searchMedicamentos);
router.get("/stock-bajo", getMedicamentosStockBajo);
router.get("/:id", getMedicamentoById);

router.post("/", createMedicamento);
router.put("/:id", updateMedicamento);
router.delete("/:id", deleteMedicamento);

export default router;