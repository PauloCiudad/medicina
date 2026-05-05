import { Router } from "express";

import {
  getConsultas,
  getConsultaById,
  getConsultasByPaciente,
  createConsulta,
  updateConsulta,
  deleteConsulta,
} from "./consultas.controller.js";

const router = Router();

router.get("/", getConsultas);
router.get("/paciente/:idPaciente", getConsultasByPaciente);
router.get("/:id", getConsultaById);

router.post("/", createConsulta);
router.put("/:id", updateConsulta);
router.delete("/:id", deleteConsulta);

export default router;