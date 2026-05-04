import * as authService from "./auth.service.js";
import { successResponse } from "../../utils/response.js";

export const login = async (req, res, next) => {
  try {
    const resultado = await authService.login(req.body);

    return successResponse(
      res,
      resultado,
      "Login correcto"
    );
  } catch (error) {
    next(error);
  }
};

export const getPerfil = async (req, res, next) => {
  try {
    return successResponse(
      res,
      req.user,
      "Perfil obtenido correctamente"
    );
  } catch (error) {
    next(error);
  }
};