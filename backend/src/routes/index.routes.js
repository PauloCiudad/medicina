import { Router } from "express";

import pacientesRoutes from "../modules/pacientes/pacientes.routes.js";
import antecedentesRoutes from "../modules/antecedentes/antecedentes.routes.js";
import consultasRoutes from "../modules/consultas/consultas.routes.js";
import recetasRoutes from "../modules/recetas/recetas.routes.js";
import medicamentosRoutes from "../modules/medicamentos/medicamentos.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";
import cie10Routes from "../modules/cie10/cie10.routes.js";

const router = Router();

router.use("/pacientes", pacientesRoutes);
router.use("/antecedentes", antecedentesRoutes);
router.use("/consultas", consultasRoutes);
router.use("/recetas", recetasRoutes);
router.use("/medicamentos", medicamentosRoutes);
router.use("/inventario", inventarioRoutes);
router.use("/cie10", cie10Routes);

export default router;