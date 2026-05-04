import { Router } from "express";

import pacientesRoutes from "../modules/pacientes/pacientes.routes.js";
import antecedentesRoutes from "../modules/antecedentes/antecedentes.routes.js";

const router = Router();

router.use("/pacientes", pacientesRoutes);
router.use("/antecedentes", antecedentesRoutes);

export default router;