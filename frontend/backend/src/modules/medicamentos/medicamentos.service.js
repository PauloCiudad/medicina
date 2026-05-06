import * as medicamentosRepository from "./medicamentos.repository.js";

export const getMedicamentos = async () => {
  return await medicamentosRepository.findAll();
};

export const getMedicamentoById = async (id) => {
  const medicamento = await medicamentosRepository.findById(id);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  return medicamento;
};

export const getMedicamentosStockBajo = async (limite) => {
  const limiteNumerico = Number(limite);

  if (Number.isNaN(limiteNumerico) || limiteNumerico < 0) {
    const error = new Error("El límite de stock debe ser un número válido");
    error.status = 400;
    throw error;
  }

  return await medicamentosRepository.findStockBajo(limiteNumerico);
};

export const searchMedicamentos = async (query) => {
  if (!query || query.trim() === "") {
    return await medicamentosRepository.findAll();
  }

  return await medicamentosRepository.searchByName(query.trim());
};

export const createMedicamento = async (data) => {
  const { nombre, cantidad, stock = 0 } = data;

  if (!nombre || nombre.trim() === "") {
    const error = new Error("El campo nombre es obligatorio");
    error.status = 400;
    throw error;
  }

  if (!cantidad || cantidad.trim() === "") {
    const error = new Error("El campo cantidad es obligatorio");
    error.status = 400;
    throw error;
  }

  if (Number.isNaN(Number(stock)) || Number(stock) < 0) {
    const error = new Error("El stock debe ser un número mayor o igual a 0");
    error.status = 400;
    throw error;
  }

  const existeMedicamento = await medicamentosRepository.findByNombreYCantidad(
    nombre.trim(),
    cantidad.trim()
  );

  if (existeMedicamento) {
    const error = new Error("Ya existe un medicamento con el mismo nombre y cantidad");
    error.status = 409;
    throw error;
  }

  const nuevoMedicamento = await medicamentosRepository.create({
    nombre: nombre.trim(),
    cantidad: cantidad.trim(),
    stock: Number(stock),
  });

  return await getMedicamentoById(nuevoMedicamento.id);
};

export const updateMedicamento = async (id, data) => {
  const medicamento = await medicamentosRepository.findById(id);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  const { nombre, cantidad, stock } = data;

  if (nombre !== undefined && nombre.trim() === "") {
    const error = new Error("El campo nombre no puede estar vacío");
    error.status = 400;
    throw error;
  }

  if (cantidad !== undefined && cantidad.trim() === "") {
    const error = new Error("El campo cantidad no puede estar vacío");
    error.status = 400;
    throw error;
  }

  if (stock !== undefined) {
    if (Number.isNaN(Number(stock)) || Number(stock) < 0) {
      const error = new Error("El stock debe ser un número mayor o igual a 0");
      error.status = 400;
      throw error;
    }
  }

  await medicamentosRepository.update(id, {
    nombre: nombre?.trim(),
    cantidad: cantidad?.trim(),
    stock: stock !== undefined ? Number(stock) : undefined,
  });

  return await getMedicamentoById(id);
};

export const deleteMedicamento = async (id) => {
  const medicamento = await medicamentosRepository.findById(id);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  return await medicamentosRepository.remove(id);
};