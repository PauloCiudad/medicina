import * as pacientesService from "./pacientes.service.js";
import { successResponse } from "../../utils/response.js";

export const getPacientes = async (req, res, next) => {
  try {
    const pacientes = await pacientesService.getPacientes();
    return successResponse(res, pacientes, "Pacientes obtenidos correctamente");
  } catch (error) {
    next(error);
  }
};

export const getPacienteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paciente = await pacientesService.getPacienteById(id);
    return successResponse(res, paciente, "Paciente obtenido correctamente");
  } catch (error) {
    next(error);
  }
};

export const createPaciente = async (req, res, next) => {
  try {
    const nuevoPaciente = await pacientesService.createPaciente(req.body);
    return successResponse(res, nuevoPaciente, "Paciente creado correctamente", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePaciente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pacienteActualizado = await pacientesService.updatePaciente(id, req.body);
    return successResponse(res, pacienteActualizado, "Paciente actualizado correctamente");
  } catch (error) {
    next(error);
  }
};

export const deletePaciente = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pacientesService.deletePaciente(id);
    return successResponse(res, null, "Paciente eliminado correctamente");
  } catch (error) {
    next(error);
  }
};