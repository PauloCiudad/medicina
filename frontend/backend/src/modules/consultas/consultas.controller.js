import * as consultasService from "./consultas.service.js";
import { successResponse } from "../../utils/response.js";

export const getConsultas = async (req, res, next) => {
  try {
    const consultas = await consultasService.getConsultas();

    return successResponse(
      res,
      consultas,
      "Consultas obtenidas correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getConsultaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consulta = await consultasService.getConsultaById(id);

    return successResponse(
      res,
      consulta,
      "Consulta obtenida correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getConsultasByPaciente = async (req, res, next) => {
  try {
    const { idPaciente } = req.params;

    const consultas = await consultasService.getConsultasByPaciente(idPaciente);

    return successResponse(
      res,
      consultas,
      "Consultas del paciente obtenidas correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const createConsulta = async (req, res, next) => {
  try {
    const nuevaConsulta = await consultasService.createConsulta(req.body);

    return successResponse(
      res,
      nuevaConsulta,
      "Consulta creada correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateConsulta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultaActualizada = await consultasService.updateConsulta(
      id,
      req.body
    );

    return successResponse(
      res,
      consultaActualizada,
      "Consulta actualizada correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteConsulta = async (req, res, next) => {
  try {
    const { id } = req.params;

    await consultasService.deleteConsulta(id);

    return successResponse(
      res,
      null,
      "Consulta eliminada correctamente"
    );
  } catch (error) {
    next(error);
  }
};