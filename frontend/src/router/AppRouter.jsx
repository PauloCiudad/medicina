import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import LoginPage from "../modules/auth/pages/LoginPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";

import PacienteFormPage from "../modules/pacientes/pages/PacienteFormPage";
import PacientesListadoPage from "../modules/pacientes/pages/PacientesListadoPage";

import ConsultasPacientePage from "../modules/consultas/pages/ConsultasPacientePage";
import ConsultaFormPage from "../modules/consultas/pages/ConsultaFormPage";
import ConsultasPage from "../modules/consultas/pages/ConsultasPage";

import RecetasConsultaPage from "../modules/recetas/pages/RecetasConsultaPage";
import RecetasPage from "../modules/recetas/pages/RecetasPage";
import MedicamentosPage from "../modules/medicamentos/pages/MedicamentosPage";
import InventarioPage from "../modules/inventario/pages/InventarioPage";

import MainLayout from "../layouts/MainLayout";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="pacientes" element={<PacienteFormPage />} />
          <Route path="pacientes/listado" element={<PacientesListadoPage />} />
          <Route path="pacientes/:idPaciente/editar" element={<PacienteFormPage />} />

          <Route path="consultas" element={<ConsultasPage />} />
          <Route path="pacientes/:idPaciente/consultas" element={<ConsultasPacientePage />} />
          <Route path="pacientes/:idPaciente/consultas/nueva" element={<ConsultaFormPage />} />
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