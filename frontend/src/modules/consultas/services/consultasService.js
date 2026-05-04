import apiClient from "../../../api/apiClient";

export const getConsultasRequest = async () => {
  const response = await apiClient.get("/consultas");
  return response.data.data;
};

export const getConsultaByIdRequest = async (id) => {
  const response = await apiClient.get(`/consultas/${id}`);
  return response.data.data;
};

export const getConsultasByPacienteRequest = async (idPaciente) => {
  const response = await apiClient.get(`/consultas/paciente/${idPaciente}`);
  return response.data.data;
};

export const createConsultaRequest = async (data) => {
  const response = await apiClient.post("/consultas", data);
  return response.data.data;
};

export const updateConsultaRequest = async (id, data) => {
  const response = await apiClient.put(`/consultas/${id}`, data);
  return response.data.data;
};

export const deleteConsultaRequest = async (id) => {
  const response = await apiClient.delete(`/consultas/${id}`);
  return response.data.data;
};