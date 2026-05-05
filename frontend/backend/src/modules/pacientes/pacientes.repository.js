import { pool } from "../../config/db.js";

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      DNI,
      nombre,
      nombre_2,
      apellido_pat,
      apellido_mat,
      edad,
      antecedentes_fam,
      otros_antecedentes_fam,
      antecedentes_pat,
      otros_antecedentes_pat,
      sexo,
      alergias,
      activo,
      created_at,
      updated_at
    FROM PACIENTE
    WHERE activo = 1
    ORDER BY id DESC
  `);

  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      DNI,
      nombre,
      nombre_2,
      apellido_pat,
      apellido_mat,
      edad,
      antecedentes_fam,
      otros_antecedentes_fam,
      antecedentes_pat,
      otros_antecedentes_pat,
      sexo,
      alergias,
      activo,
      created_at,
      updated_at
    FROM PACIENTE
    WHERE id = ? AND activo = 1
    `,
    [id]
  );

  return rows[0];
};

export const create = async (data) => {
  const {
    DNI,
    nombre,
    nombre_2,
    apellido_pat,
    apellido_mat,
    edad,
    antecedentes_fam,
    otros_antecedentes_fam,
    antecedentes_pat,
    otros_antecedentes_pat,
    sexo,
    alergias,
  } = data;

  const [result] = await pool.query(
    `
    INSERT INTO PACIENTE (
      DNI,
      nombre,
      nombre_2,
      apellido_pat,
      apellido_mat,
      edad,
      antecedentes_fam,
      otros_antecedentes_fam,
      antecedentes_pat,
      otros_antecedentes_pat,
      sexo,
      alergias
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      DNI,
      nombre,
      nombre_2,
      apellido_pat,
      apellido_mat,
      edad,
      antecedentes_fam,
      otros_antecedentes_fam,
      antecedentes_pat,
      otros_antecedentes_pat,
      sexo,
      alergias,
    ]
  );

  return await findById(result.insertId);
};

export const update = async (id, data) => {
  const {
    DNI,
    nombre,
    nombre_2,
    apellido_pat,
    apellido_mat,
    edad,
    antecedentes_fam,
    otros_antecedentes_fam,
    antecedentes_pat,
    otros_antecedentes_pat,
    sexo,
    alergias,
  } = data;

  await pool.query(
    `
    UPDATE PACIENTE
    SET
      DNI = ?,
      nombre = ?,
      nombre_2 = ?,
      apellido_pat = ?,
      apellido_mat = ?,
      edad = ?,
      antecedentes_fam = ?,
      otros_antecedentes_fam = ?,
      antecedentes_pat = ?,
      otros_antecedentes_pat = ?,
      sexo = ?,
      alergias = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      DNI,
      nombre,
      nombre_2,
      apellido_pat,
      apellido_mat,
      edad,
      antecedentes_fam,
      otros_antecedentes_fam,
      antecedentes_pat,
      otros_antecedentes_pat,
      sexo,
      alergias,
      id,
    ]
  );

  return await findById(id);
};

export const remove = async (id) => {
  await pool.query(
    `
    UPDATE PACIENTE
    SET activo = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id]
  );

  return true;
};