import * as recetasService from "./recetas.service.js";
import { successResponse } from "../../utils/response.js";

export const getRecetas = async (req, res, next) => {
  try {
    const recetas = await recetasService.getRecetas();

    return successResponse(
      res,
      recetas,
      "Recetas obtenidas correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getRecetaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const receta = await recetasService.getRecetaById(id);

    return successResponse(
      res,
      receta,
      "Receta obtenida correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getRecetasByConsulta = async (req, res, next) => {
  try {
    const { idConsulta } = req.params;

    const recetas = await recetasService.getRecetasByConsulta(idConsulta);

    return successResponse(
      res,
      recetas,
      "Recetas de la consulta obtenidas correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getRecetasByPaciente = async (req, res, next) => {
  try {
    const { idPaciente } = req.params;

    const recetas = await recetasService.getRecetasByPaciente(idPaciente);

    return successResponse(
      res,
      recetas,
      "Recetas del paciente obtenidas correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const createReceta = async (req, res, next) => {
  try {
    const nuevaReceta = await recetasService.createReceta(req.body);

    return successResponse(
      res,
      nuevaReceta,
      "Receta creada correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const createRecetasLote = async (req, res, next) => {
  try {
    const resultado = await recetasService.createRecetasLote(req.body);

    return successResponse(
      res,
      resultado,
      "Recetas creadas correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateReceta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recetaActualizada = await recetasService.updateReceta(id, req.body);

    return successResponse(
      res,
      recetaActualizada,
      "Receta actualizada correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteReceta = async (req, res, next) => {
  try {
    const { id } = req.params;

    await recetasService.deleteReceta(id);

    return successResponse(
      res,
      null,
      "Receta eliminada correctamente"
    );
  } catch (error) {
    next(error);
  }
};