import { pool } from "../../config/db.js";

export const findUsuarioByUsername = async (usuario) => {
  const [rows] = await pool.query(
    `
    SELECT
      u.id,
      u.id_rol,
      r.nombre AS rol,
      u.nombres,
      u.apellidos,
      u.usuario,
      u.password_hash,
      u.email,
      u.activo,
      u.created_at,
      u.updated_at
    FROM usuario u
    INNER JOIN rol r
      ON r.id = u.id_rol
    WHERE u.usuario = ?
    LIMIT 1
    `,
    [usuario]
  );

  return rows[0];
};

export const findUsuarioById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      u.id,
      u.id_rol,
      r.nombre AS rol,
      u.nombres,
      u.apellidos,
      u.usuario,
      u.email,
      u.activo,
      u.created_at,
      u.updated_at
    FROM usuario u
    INNER JOIN rol r
      ON r.id = u.id_rol
    WHERE u.id = ?
      AND u.activo = 1
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};