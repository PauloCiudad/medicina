import apiClient from "../../../api/apiClient";

export const getMedicamentosRequest = async () => {
  const response = await apiClient.get("/medicamentos");
  return response.data.data;
};

export const getMedicamentoByIdRequest = async (id) => {
  const response = await apiClient.get(`/medicamentos/${id}`);
  return response.data.data;
};

export const searchMedicamentosRequest = async (query) => {
  const response = await apiClient.get(
    `/medicamentos/buscar?q=${encodeURIComponent(query)}`
  );

  return response.data.data;
};

export const getMedicamentosStockBajoRequest = async (limite = 10) => {
  const response = await apiClient.get(
    `/medicamentos/stock-bajo?limite=${limite}`
  );

  return response.data.data;
};

export const createMedicamentoRequest = async (data) => {
  const response = await apiClient.post("/medicamentos", data);
  return response.data.data;
};

export const updateMedicamentoRequest = async (id, data) => {
  const response = await apiClient.put(`/medicamentos/${id}`, data);
  return response.data.data;
};

export const deleteMedicamentoRequest = async (id) => {
  const response = await apiClient.delete(`/medicamentos/${id}`);
  return response.data.data;
};