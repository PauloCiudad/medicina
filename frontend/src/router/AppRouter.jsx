import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import PacienteFormPage from "../modules/pacientes/pages/PacienteFormPage";
import PacientesListadoPage from "../modules/pacientes/pages/PacientesListadoPage";
import ConsultasPage from "../modules/consultas/pages/ConsultasPage";
import ConsultasPacientePage from "../modules/consultas/pages/ConsultasPacientePage";
import ConsultaFormPage from "../modules/consultas/pages/ConsultaFormPage";
import RecetasPage from "../modules/recetas/pages/RecetasPage";
import RecetasConsultaPage from "../modules/recetas/pages/RecetasConsultaPage";
import MedicamentosPage from "../modules/medicamentos/pages/MedicamentosPage";
import InventarioPage from "../modules/inventario/pages/InventarioPage";

import MainLayout from "../layouts/MainLayout";

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="pacientes" element={<PacienteFormPage />} />
          <Route path="pacientes/listado" element={<PacientesListadoPage />} />
          <Route path="pacientes/:idPaciente/editar" element={<PacienteFormPage />} />

          <Route path="consultas" element={<ConsultasPage />} />
          <Route
            path="pacientes/:idPaciente/consultas"
            element={<ConsultasPacientePage />}
          />
          <Route
            path="pacientes/:idPaciente/consultas/nueva"
            element={<ConsultaFormPage />}
          />
          <Route path="consultas/:idConsulta/editar" element={<ConsultaFormPage />} />
          <Route path="consultas/:idConsulta/recetas" element={<RecetasConsultaPage />} />

          <Route path="recetas" element={<RecetasPage />} />
          <Route path="medicamentos" element={<MedicamentosPage />} />
          <Route path="inventario" element={<InventarioPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}