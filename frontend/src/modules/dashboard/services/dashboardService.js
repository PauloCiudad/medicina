import apiClient from "../../../api/apiClient";

export const getDashboardDataRequest = async () => {
  const [
    pacientesResponse,
    consultasResponse,
    medicamentosResponse,
    stockBajoResponse,
    movimientosResponse,
  ] = await Promise.all([
    apiClient.get("/pacientes"),
    apiClient.get("/consultas"),
    apiClient.get("/medicamentos"),
    apiClient.get("/medicamentos/stock-bajo?limite=10"),
    apiClient.get("/inventario/movimientos"),
  ]);

  return {
    pacientes: pacientesResponse.data.data || [],
    consultas: consultasResponse.data.data || [],
    medicamentos: medicamentosResponse.data.data || [],
    stockBajo: stockBajoResponse.data.data || [],
    movimientos: movimientosResponse.data.data || [],
  };
};