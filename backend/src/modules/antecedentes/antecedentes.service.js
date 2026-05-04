import * as antecedentesRepository from "./antecedentes.repository.js";

export const getCatalogoAntecedentes = async () => {
  return await antecedentesRepository.findCatalogo();
};

export const getAntecedentesByPaciente = async (idPaciente) => {
  const paciente = await antecedentesRepository.findPacienteById(idPaciente);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  const antecedentes = await antecedentesRepository.findByPaciente(idPaciente);

  const familiares = antecedentes.filter(
    (item) => item.tipo === "FAMILIAR"
  );

  const patologicos = antecedentes.filter(
    (item) => item.tipo === "PATOLOGICO"
  );

  return {
    paciente,
    familiares,
    patologicos,
  };
};

export const saveAntecedentesPaciente = async (idPaciente, data) => {
  const paciente = await antecedentesRepository.findPacienteById(idPaciente);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  const {
    antecedentes_familiares = [],
    antecedentes_patologicos = [],
    otros_antecedentes_fam = null,
    otros_antecedentes_pat = null,
  } = data;

  if (!Array.isArray(antecedentes_familiares)) {
    const error = new Error("antecedentes_familiares debe ser un arreglo");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(antecedentes_patologicos)) {
    const error = new Error("antecedentes_patologicos debe ser un arreglo");
    error.status = 400;
    throw error;
  }

  await antecedentesRepository.saveAntecedentesPaciente({
    idPaciente,
    antecedentesFamiliares: antecedentes_familiares,
    antecedentesPatologicos: antecedentes_patologicos,
    otrosAntecedentesFam: otros_antecedentes_fam,
    otrosAntecedentesPat: otros_antecedentes_pat,
  });

  return await getAntecedentesByPaciente(idPaciente);
};