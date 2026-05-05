import { pool } from "../../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo,
      created_at,
      updated_at
    FROM medicamento
    WHERE activo = 1
    ORDER BY nombre ASC
  `);

  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo,
      created_at,
      updated_at
    FROM medicamento
    WHERE id = ?
      AND activo = 1
    `,
    [id]
  );

  return rows[0];
};

export const findByNombreYCantidad = async (nombre, cantidad) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo
    FROM medicamento
    WHERE LOWER(nombre) = LOWER(?)
      AND LOWER(cantidad) = LOWER(?)
      AND activo = 1
    `,
    [nombre, cantidad]
  );

  return rows[0];
};

export const searchByName = async (query) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo,
      created_at,
      updated_at
    FROM medicamento
    WHERE activo = 1
      AND (
        nombre LIKE ?
        OR cantidad LIKE ?
      )
    ORDER BY nombre ASC
    `,
    [`%${query}%`, `%${query}%`]
  );

  return rows;
};

export const findStockBajo = async (limite) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo,
      created_at,
      updated_at
    FROM medicamento
    WHERE activo = 1
      AND stock <= ?
    ORDER BY stock ASC, nombre ASC
    `,
    [limite]
  );

  return rows;
};

export const create = async (data) => {
  const { nombre, cantidad, stock } = data;

  const [result] = await pool.query(
    `
    INSERT INTO medicamento (
      nombre,
      cantidad,
      stock
    ) VALUES (?, ?, ?)
    `,
    [nombre, cantidad, stock]
  );

  return {
    id: result.insertId,
  };
};

export const update = async (id, data) => {
  const { nombre, cantidad, stock } = data;

  await pool.query(
    `
    UPDATE medicamento
    SET
      nombre = COALESCE(?, nombre),
      cantidad = COALESCE(?, cantidad),
      stock = COALESCE(?, stock),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      nombre ?? null,
      cantidad ?? null,
      stock ?? null,
      id,
    ]
  );

  return true;
};

export const remove = async (id) => {
  await pool.query(
    `
    UPDATE medicamento
    SET activo = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id]
  );

  return true;
};