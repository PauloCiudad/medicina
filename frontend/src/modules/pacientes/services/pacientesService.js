import apiClient from "../../../api/apiClient";

export const getPacientesRequest = async () => {
  const response = await apiClient.get("/pacientes");
  return response.data.data;
};

export const getPacienteByIdRequest = async (id) => {
  const response = await apiClient.get(`/pacientes/${id}`);
  return response.data.data;
};

export const createPacienteRequest = async (data) => {
  const response = await apiClient.post("/pacientes", data);
  return response.data.data;
};

export const updatePacienteRequest = async (id, data) => {
  const response = await apiClient.put(`/pacientes/${id}`, data);
  return response.data.data;
};

export const deletePacienteRequest = async (id) => {
  const response = await apiClient.delete(`/pacientes/${id}`);
  return response.data.data;
};