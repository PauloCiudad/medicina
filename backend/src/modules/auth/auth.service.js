import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";

export const login = async (data) => {
  const { usuario, password } = data;

  if (!usuario || usuario.trim() === "") {
    const error = new Error("El usuario es obligatorio");
    error.status = 400;
    throw error;
  }

  if (!password || password.trim() === "") {
    const error = new Error("La contraseña es obligatoria");
    error.status = 400;
    throw error;
  }

  const user = await authRepository.findUsuarioByUsername(usuario.trim());

  if (!user) {
    const error = new Error("Usuario o contraseña incorrectos");
    error.status = 401;
    throw error;
  }

  if (Number(user.activo) !== 1) {
    const error = new Error("El usuario se encuentra inactivo");
    error.status = 403;
    throw error;
  }

  const passwordCorrecto = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordCorrecto) {
    const error = new Error("Usuario o contraseña incorrectos");
    error.status = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    usuario: user.usuario,
    id_rol: user.id_rol,
    rol: user.rol,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      usuario: user.usuario,
      email: user.email,
      id_rol: user.id_rol,
      rol: user.rol,
    },
  };
};