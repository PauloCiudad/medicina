import * as inventarioService from "./inventario.service.js";
import { successResponse } from "../../utils/response.js";

export const getMovimientos = async (req, res, next) => {
  try {
    const movimientos = await inventarioService.getMovimientos();

    return successResponse(
      res,
      movimientos,
      "Movimientos de inventario obtenidos correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const getMovimientosByMedicamento = async (req, res, next) => {
  try {
    const { idMedicamento } = req.params;

    const movimientos = await inventarioService.getMovimientosByMedicamento(
      idMedicamento
    );

    return successResponse(
      res,
      movimientos,
      "Movimientos del medicamento obtenidos correctamente"
    );
  } catch (error) {
    next(error);
  }
};

export const registrarEntrada = async (req, res, next) => {
  try {
    const resultado = await inventarioService.registrarEntrada(req.body);

    return successResponse(
      res,
      resultado,
      "Entrada de inventario registrada correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const registrarSalida = async (req, res, next) => {
  try {
    const resultado = await inventarioService.registrarSalida(req.body);

    return successResponse(
      res,
      resultado,
      "Salida de inventario registrada correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const registrarAjuste = async (req, res, next) => {
  try {
    const resultado = await inventarioService.registrarAjuste(req.body);

    return successResponse(
      res,
      resultado,
      "Ajuste de inventario registrado correctamente",
      201
    );
  } catch (error) {
    next(error);
  }
};