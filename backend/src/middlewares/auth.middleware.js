import jwt from "jsonwebtoken";
import * as authRepository from "../modules/auth/auth.repository.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error("Token no enviado");
      error.status = 401;
      throw error;
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      const error = new Error("Formato de token inválido");
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await authRepository.findUsuarioById(decoded.id);

    if (!usuario) {
      const error = new Error("Usuario no válido o inactivo");
      error.status = 401;
      throw error;
    }

    req.user = usuario;

    next();
  } catch (error) {
    error.status = error.status || 401;
    error.message = error.message || "No autorizado";
    next(error);
  }
};