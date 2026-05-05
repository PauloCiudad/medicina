import * as consultasRepository from "./consultas.repository.js";

export const getConsultas = async () => {
  return await consultasRepository.findAll();
};

export const getConsultaById = async (id) => {
  const consulta = await consultasRepository.findById(id);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  const signosVitales = await consultasRepository.findSignosVitalesByConsulta(id);

  return {
    ...consulta,
    signos_vitales: signosVitales || null,
  };
};

export const getConsultasByPaciente = async (idPaciente) => {
  const paciente = await consultasRepository.findPacienteById(idPaciente);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  const consultas = await consultasRepository.findByPaciente(idPaciente);

  return {
    paciente,
    consultas,
  };
};

export const createConsulta = async (data) => {
  const { id_paciente, motivo_consulta, diagnostico = null, medicacion = 0, fecha_atencion } = data;

  if (!id_paciente) {
    const error = new Error("El campo id_paciente es obligatorio");
    error.status = 400;
    throw error;
  }

  const paciente = await consultasRepository.findPacienteById(id_paciente);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  if (![0, 1, false, true].includes(medicacion)) {
    const error = new Error("El campo medicacion debe ser 0 o 1");
    error.status = 400;
    throw error;
  }

  const nuevaConsulta = await consultasRepository.create(data);

  return await getConsultaById(nuevaConsulta.id);
};

export const updateConsulta = async (id, data) => {
  const consulta = await consultasRepository.findById(id);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  await consultasRepository.update(id, data);

  return await getConsultaById(id);
};

export const deleteConsulta = async (id) => {
  const consulta = await consultasRepository.findById(id);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  return await consultasRepository.remove(id);
};