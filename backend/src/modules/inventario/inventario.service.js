import * as inventarioRepository from "./inventario.repository.js";

const validarCantidadPositiva = (cantidad, nombreCampo = "cantidad") => {
  const cantidadNumerica = Number(cantidad);

  if (
    Number.isNaN(cantidadNumerica) ||
    cantidadNumerica <= 0 ||
    !Number.isInteger(cantidadNumerica)
  ) {
    const error = new Error(`El campo ${nombreCampo} debe ser un número entero mayor a 0`);
    error.status = 400;
    throw error;
  }

  return cantidadNumerica;
};

export const getMovimientos = async () => {
  return await inventarioRepository.findAllMovimientos();
};

export const getMovimientosByMedicamento = async (idMedicamento) => {
  const medicamento = await inventarioRepository.findMedicamentoById(idMedicamento);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  const movimientos = await inventarioRepository.findMovimientosByMedicamento(
    idMedicamento
  );

  return {
    medicamento,
    movimientos,
  };
};

export const registrarEntrada = async (data) => {
  const {
    id_medicamento,
    cantidad,
    motivo = "Entrada manual de inventario",
  } = data;

  if (!id_medicamento) {
    const error = new Error("El campo id_medicamento es obligatorio");
    error.status = 400;
    throw error;
  }

  const cantidadNumerica = validarCantidadPositiva(cantidad);

  const medicamento = await inventarioRepository.findMedicamentoById(
    id_medicamento
  );

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  await inventarioRepository.registrarMovimientoEntrada({
    idMedicamento: id_medicamento,
    cantidad: cantidadNumerica,
    motivo,
  });

  return await inventarioRepository.findMedicamentoById(id_medicamento);
};

export const registrarSalida = async (data) => {
  const {
    id_medicamento,
    cantidad,
    motivo = "Salida manual de inventario",
    id_usuario = null,
    id_consulta = null,
    id_receta = null,
  } = data;

  if (!id_medicamento) {
    const error = new Error("El campo id_medicamento es obligatorio");
    error.status = 400;
    throw error;
  }

  const cantidadNumerica = validarCantidadPositiva(cantidad);

  const medicamento = await inventarioRepository.findMedicamentoById(id_medicamento);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  if (Number(medicamento.stock) < cantidadNumerica) {
    const error = new Error(
      `Stock insuficiente. Stock actual: ${medicamento.stock}`
    );
    error.status = 400;
    throw error;
  }

  if (id_receta) {
    const receta = await inventarioRepository.findRecetaById(id_receta);

    if (!receta) {
      const error = new Error("Receta no encontrada");
      error.status = 404;
      throw error;
    }

    if (Number(receta.id_medicamento) !== Number(id_medicamento)) {
      const error = new Error("La receta no corresponde al medicamento enviado");
      error.status = 400;
      throw error;
    }
  }

  await inventarioRepository.registrarMovimientoSalida({
    idMedicamento: id_medicamento,
    cantidad: cantidadNumerica,
    motivo,
    idUsuario: id_usuario,
    idConsulta: id_consulta,
    idReceta: id_receta,
  });

  return await inventarioRepository.findMedicamentoById(id_medicamento);
};

export const registrarAjuste = async (data) => {
  const {
    id_medicamento,
    nuevo_stock,
    motivo = "Ajuste manual de inventario",
    id_usuario = null,
  } = data;

  if (!id_medicamento) {
    const error = new Error("El campo id_medicamento es obligatorio");
    error.status = 400;
    throw error;
  }

  const nuevoStockNumerico = Number(nuevo_stock);

  if (
    Number.isNaN(nuevoStockNumerico) ||
    nuevoStockNumerico < 0 ||
    !Number.isInteger(nuevoStockNumerico)
  ) {
    const error = new Error("El campo nuevo_stock debe ser un número entero mayor o igual a 0");
    error.status = 400;
    throw error;
  }

  const medicamento = await inventarioRepository.findMedicamentoById(id_medicamento);

  if (!medicamento) {
    const error = new Error("Medicamento no encontrado");
    error.status = 404;
    throw error;
  }

  const stockActual = Number(medicamento.stock);
  const diferencia = nuevoStockNumerico - stockActual;

  if (diferencia === 0) {
    return medicamento;
  }

  await inventarioRepository.registrarMovimientoAjuste({
    idMedicamento: id_medicamento,
    stockAnterior: stockActual,
    nuevoStock: nuevoStockNumerico,
    diferencia,
    motivo,
    idUsuario: id_usuario,
  });

  return await inventarioRepository.findMedicamentoById(id_medicamento);
};