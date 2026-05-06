import * as cie10Repository from "./cie10.repository.js";

export const searchCie10 = async (query, limit = 20) => {
  const texto = query.trim();

  if (!texto) {
    return [];
  }

  const limiteNumerico = Number(limit);

  if (Number.isNaN(limiteNumerico) || limiteNumerico <= 0) {
    const error = new Error("El límite debe ser un número mayor a 0");
    error.status = 400;
    throw error;
  }

  return await cie10Repository.search(texto, limiteNumerico);
};

export const getCie10ById = async (id) => {
  const diagnostico = await cie10Repository.findById(id);

  if (!diagnostico) {
    const error = new Error("Diagnóstico CIE10 no encontrado");
    error.status = 404;
    throw error;
  }

  return diagnostico;
};