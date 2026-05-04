import apiClient from "../../../api/apiClient";

export const getRecetasRequest = async () => {
  const response = await apiClient.get("/recetas");
  return response.data.data;
};

export const getRecetaByIdRequest = async (id) => {
  const response = await apiClient.get(`/recetas/${id}`);
  return response.data.data;
};

export const getRecetasByConsultaRequest = async (idConsulta) => {
  const response = await apiClient.get(`/recetas/consulta/${idConsulta}`);
  return response.data.data;
};

export const getRecetasByPacienteRequest = async (idPaciente) => {
  const response = await apiClient.get(`/recetas/paciente/${idPaciente}`);
  return response.data.data;
};

export const createRecetaRequest = async (data) => {
  const response = await apiClient.post("/recetas", data);
  return response.data.data;
};

export const updateRecetaRequest = async (id, data) => {
  const response = await apiClient.put(`/recetas/${id}`, data);
  return response.data.data;
};

export const deleteRecetaRequest = async (id) => {
  const response = await apiClient.delete(`/recetas/${id}`);
  return response.data.data;
};