import { Router } from "express";

import pacientesRoutes from "../modules/pacientes/pacientes.routes.js";
import antecedentesRoutes from "../modules/antecedentes/antecedentes.routes.js";
import consultasRoutes from "../modules/consultas/consultas.routes.js";
import recetasRoutes from "../modules/recetas/recetas.routes.js";
import medicamentosRoutes from "../modules/medicamentos/medicamentos.routes.js";
import inventarioRoutes from "../modules/inventario/inventario.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/pacientes", authMiddleware, pacientesRoutes);
router.use("/antecedentes", authMiddleware, antecedentesRoutes);
router.use("/consultas", authMiddleware, consultasRoutes);
router.use("/recetas", authMiddleware, recetasRoutes);
router.use("/medicamentos", authMiddleware, medicamentosRoutes);
router.use("/inventario", authMiddleware, inventarioRoutes);

export default router;