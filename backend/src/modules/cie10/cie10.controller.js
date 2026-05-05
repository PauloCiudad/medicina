import * as cie10Service from "./cie10.service.js";
import { successResponse } from "../../utils/response.js";

export const searchCie10 = async (req, res, next) => {
  try {
    const { q = "", limit = 20 } = req.query;

    const resultados = await cie10Service.searchCie10(q, limit);

    return successResponse(
      res,
      resultados,
      "Búsqueda CIE10 realizada correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getCie10ById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const diagnostico = await cie10Service.getCie10ById(id);

    return successResponse(
      res,
      diagnostico,
      "Diagnóstico CIE10 obtenido correctamente"
    );
  } catch (error) {
    next(error);
  }
};