import * as recetasRepository from "./recetas.repository.js";

export const getRecetas = async () => {
  return await recetasRepository.findAll();
};

export const getRecetaById = async (id) => {
  const receta = await recetasRepository.findById(id);

  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  return receta;
};

export const getRecetasByConsulta = async (idConsulta) => {
  const consulta = await recetasRepository.findConsultaById(idConsulta);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  const recetas = await recetasRepository.findByConsulta(idConsulta);

  return {
    consulta,
    recetas,
  };
};

export const getRecetasByPaciente = async (idPaciente) => {
  const paciente = await recetasRepository.findPacienteById(idPaciente);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    error.status = 404;
    throw error;
  }

  const recetas = await recetasRepository.findByPaciente(idPaciente);

  return {
    paciente,
    recetas,
  };
};

export const createReceta = async (data, idUsuario = null) => {
  const {
    id_consulta,
    id_medicamento,
    dosis,
    cantidad_entregada = 0,
  } = data;

  if (!id_consulta) {
    const error = new Error("El campo id_consulta es obligatorio");
    error.status = 400;
    throw error;
  }

  if (!id_medicamento) {
    const error = new Error("El campo id_medicamento es obligatorio");
    error.status = 400;
    throw error;
  }

  if (!dosis || dosis.trim() === "") {
    const error = new Error("El campo dosis es obligatorio");
    error.status = 400;
    throw error;
  }

  if (Number(cantidad_entregada) < 0) {
    const error = new Error("La cantidad entregada no puede ser negativa");
    error.status = 400;
    throw error;
  }

  const consulta = await recetasRepository.findConsultaById(id_consulta);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  const medicamento = await recetasRepository.findMedicamentoById(id_medicamento);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  if (Number(cantidad_entregada) > Number(medicamento.stock)) {
    const error = new Error(
      `Stock insuficiente. Stock actual: ${medicamento.stock}`
    );
    error.status = 400;
    throw error;
  }

  const nuevaReceta = await recetasRepository.create(data, idUsuario);

  return await getRecetaById(nuevaReceta.id);
};

export const createRecetasLote = async (data) => {
  const { id_consulta, medicamentos = [] } = data;

  if (!id_consulta) {
    const error = new Error("El campo id_consulta es obligatorio");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
    const error = new Error("El campo medicamentos debe ser un arreglo con al menos un medicamento");
    error.status = 400;
    throw error;
  }

  const consulta = await recetasRepository.findConsultaById(id_consulta);

  if (!consulta) {
    const error = new Error("Consulta no encontrada");
    error.status = 404;
    throw error;
  }

  for (const item of medicamentos) {
    if (!item.id_medicamento) {
      const error = new Error("Cada medicamento debe tener id_medicamento");
      error.status = 400;
      throw error;
    }

    if (!item.dosis) {
      const error = new Error("Cada medicamento debe tener dosis");
      error.status = 400;
      throw error;
    }

    const medicamento = await recetasRepository.findMedicamentoById(
      item.id_medicamento
    );

    if (!medicamento) {
      const error = new Error(
        `Medicamento no encontrado: ${item.id_medicamento}`
      );
      error.status = 404;
      throw error;
    }
  }

  await recetasRepository.createBatch(id_consulta, medicamentos);

  return await getRecetasByConsulta(id_consulta);
};

export const updateReceta = async (id, data) => {
  const receta = await recetasRepository.findById(id);

  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  if (data.id_medicamento) {
    const medicamento = await recetasRepository.findMedicamentoById(
      data.id_medicamento
    );

    if (!medicamento) {
      const error = new Error("Medicamento no encontrado");
      error.status = 404;
      throw error;
    }
  }

  if (data.cantidad_entregada !== undefined && data.cantidad_entregada < 0) {
    const error = new Error("La cantidad entregada no puede ser negativa");
    error.status = 400;
    throw error;
  }

  await recetasRepository.update(id, data);

  return await getRecetaById(id);
};

export const deleteReceta = async (id) => {
  const receta = await recetasRepository.findById(id);

  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  return await recetasRepository.remove(id);
};