import * as pacientesRepository from "./pacientes.repository.js";

export const getPacientes = async () => {
  return await pacientesRepository.findAll();
};

export const getPacienteById = async (id) => {
  const paciente = await pacientesRepository.findById(id);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  return paciente;
};

export const createPaciente = async (data) => {
  return await pacientesRepository.create(data);
};

export const updatePaciente = async (id, data) => {
  const existePaciente = await pacientesRepository.findById(id);

  if (!existePaciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  return await pacientesRepository.update(id, data);
};

export const deletePaciente = async (id) => {
  const existePaciente = await pacientesRepository.findById(id);

  if (!existePaciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  return await pacientesRepository.remove(id);
};