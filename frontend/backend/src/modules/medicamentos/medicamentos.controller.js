import * as medicamentosService from "./medicamentos.service.js";
import { successResponse } from "../../utils/response.js";

export const getMedicamentos = async (req, res, next) => {
  try {
    const medicamentos = await medicamentosService.getMedicamentos();

    return successResponse(
      res,
      medicamentos,
      "Medicamentos obtenidos correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getMedicamentoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicamento = await medicamentosService.getMedicamentoById(id);

    return successResponse(
      res,
      medicamento,
      "Medicamento obtenido correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getMedicamentosStockBajo = async (req, res, next) => {
  try {
    const { limite = 10 } = req.query;

    const medicamentos = await medicamentosService.getMedicamentosStockBajo(
      limite
    );

    return successResponse(
      res,
      medicamentos,
      "Medicamentos con stock bajo obtenidos correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const searchMedicamentos = async (req, res, next) => {
  try {
    const { q = "" } = req.query;

    const medicamentos = await medicamentosService.searchMedicamentos(q);

    return successResponse(
      res,
      medicamentos,
      "Búsqueda de medicamentos realizada correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const createMedicamento = async (req, res, next) => {
  try {
    const nuevoMedicamento = await medicamentosService.createMedicamento(
      req.body
    );

    return successResponse(
      res,
      nuevoMedicamento,
      "Medicamento creado correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateMedicamento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicamentoActualizado = await medicamentosService.updateMedicamento(
      id,
      req.body
    );

    return successResponse(
      res,
      medicamentoActualizado,
      "Medicamento actualizado correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMedicamento = async (req, res, next) => {
  try {
    const { id } = req.params;

    await medicamentosService.deleteMedicamento(id);

    return successResponse(
      res,
      null,
      "Medicamento eliminado correctamente"
    );
  } catch (error) {
    next(error);
  }
};