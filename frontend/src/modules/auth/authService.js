import apiClient from "../../api/apiClient";

export const loginRequest = async ({ usuario, password }) => {
  const response = await apiClient.post("/auth/login", {
    usuario,
    password,
  });

  return response.data.data;
};

export const getPerfilRequest = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data.data;
};