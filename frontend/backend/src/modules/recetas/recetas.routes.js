import { Router } from "express";

import {
  getRecetas,
  getRecetaById,
  getRecetasByConsulta,
  getRecetasByPaciente,
  createReceta,
  createRecetasLote,
  updateReceta,
  deleteReceta,
} from "./recetas.controller.js";

const router = Router();

router.get("/", getRecetas);
router.get("/consulta/:idConsulta", getRecetasByConsulta);
router.get("/paciente/:idPaciente", getRecetasByPaciente);
router.get("/:id", getRecetaById);

router.post("/", createReceta);
router.post("/lote", createRecetasLote);

router.put("/:id", updateReceta);
router.delete("/:id", deleteReceta);

export default router;