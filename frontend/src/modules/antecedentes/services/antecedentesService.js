import apiClient from "../../../api/apiClient";

export const getCatalogoAntecedentesRequest = async () => {
  const response = await apiClient.get("/antecedentes/catalogo");
  return response.data.data;
};

export const getAntecedentesPacienteRequest = async (idPaciente) => {
  const response = await apiClient.get(`/antecedentes/paciente/${idPaciente}`);
  return response.data.data;
};

export const saveAntecedentesPacienteRequest = async (idPaciente, data) => {
  const response = await apiClient.post(
    `/antecedentes/paciente/${idPaciente}`,
    data
  );

  return response.data.data;
};