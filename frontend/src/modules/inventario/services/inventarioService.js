import apiClient from "../../../api/apiClient";

export const getMovimientosInventarioRequest = async () => {
  const response = await apiClient.get("/inventario/movimientos");
  return response.data.data;
};

export const getMovimientosByMedicamentoRequest = async (idMedicamento) => {
  const response = await apiClient.get(
    `/inventario/medicamento/${idMedicamento}/movimientos`
  );

  return response.data.data;
};

export const registrarEntradaRequest = async (data) => {
  const response = await apiClient.post("/inventario/entrada", data);
  return response.data.data;
};

export const registrarSalidaRequest = async (data) => {
  const response = await apiClient.post("/inventario/salida", data);
  return response.data.data;
};

export const registrarAjusteRequest = async (data) => {
  const response = await apiClient.post("/inventario/ajuste", data);
  return response.data.data;
};