import * as antecedentesService from "./antecedentes.service.js";
import { successResponse } from "../../utils/response.js";

export const getCatalogoAntecedentes = async (req, res, next) => {
  try {
    const antecedentes = await antecedentesService.getCatalogoAntecedentes();

    return successResponse(
      res,
      antecedentes,
      "Catálogo de antecedentes obtenido correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getAntecedentesByPaciente = async (req, res, next) => {
  try {
    const { idPaciente } = req.params;

    const antecedentes = await antecedentesService.getAntecedentesByPaciente(
      idPaciente
    );

    return successResponse(
      res,
      antecedentes,
      "Antecedentes del paciente obtenidos correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const saveAntecedentesPaciente = async (req, res, next) => {
  try {
    const { idPaciente } = req.params;

    const resultado = await antecedentesService.saveAntecedentesPaciente(
      idPaciente,
      req.body
    );

    return successResponse(
      res,
      resultado,
      "Antecedentes del paciente guardados correctamente"
    );
  } catch (error) {
    next(error);
  }
};