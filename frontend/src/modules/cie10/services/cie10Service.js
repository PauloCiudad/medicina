import apiClient from "../../../api/apiClient";

export const searchCie10Request = async (query, limit = 20) => {
  const response = await apiClient.get(
    `/cie10/buscar?q=${encodeURIComponent(query)}&limit=${limit}`
  );

  return response.data.data;
};

export const getCie10ByIdRequest = async (id) => {
  const response = await apiClient.get(`/cie10/${id}`);
  return response.data.data;
};