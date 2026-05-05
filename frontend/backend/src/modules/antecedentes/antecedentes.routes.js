import { Router } from "express";

import {
  getCatalogoAntecedentes,
  getAntecedentesByPaciente,
  saveAntecedentesPaciente,
} from "./antecedentes.controller.js";

const router = Router();

router.get("/catalogo", getCatalogoAntecedentes);

router.get("/paciente/:idPaciente", getAntecedentesByPaciente);

router.post("/paciente/:idPaciente", saveAntecedentesPaciente);

export default router;