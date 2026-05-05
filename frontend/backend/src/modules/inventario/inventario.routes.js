import { Router } from "express";

import {
  getMovimientos,
  getMovimientosByMedicamento,
  registrarEntrada,
  registrarSalida,
  registrarAjuste,
} from "./inventario.controller.js";

const router = Router();

router.get("/movimientos", getMovimientos);
router.get("/medicamento/:idMedicamento/movimientos", getMovimientosByMedicamento);

router.post("/entrada", registrarEntrada);
router.post("/salida", registrarSalida);
router.post("/ajuste", registrarAjuste);

export default router;