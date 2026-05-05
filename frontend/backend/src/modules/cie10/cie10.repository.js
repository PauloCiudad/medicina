import { pool } from "../../config/db.js";

export const search = async (query, limit) => {
  const searchText = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      id,
      codigo,
      descripcion,
      capitulo,
      grupo,
      activo
    FROM cie10
    WHERE activo = 1
      AND (
        codigo LIKE ?
        OR descripcion LIKE ?
        OR capitulo LIKE ?
        OR grupo LIKE ?
      )
    ORDER BY
      CASE
        WHEN codigo = ? THEN 1
        WHEN codigo LIKE ? THEN 2
        WHEN descripcion LIKE ? THEN 3
        ELSE 4
      END,
      codigo ASC
    LIMIT ?
    `,
    [
      searchText,
      searchText,
      searchText,
      searchText,
      query,
      `${query}%`,
      searchText,
      limit,
    ]
  );

  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      codigo,
      descripcion,
      capitulo,
      grupo,
      activo
    FROM cie10
    WHERE id = ?
      AND activo = 1
    `,
    [id]
  );

  return rows[0];
};