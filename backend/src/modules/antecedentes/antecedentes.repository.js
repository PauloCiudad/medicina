import { pool } from "../../config/db.js";

export const findPacienteById = async (idPaciente) => {
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
      otros_antecedentes_fam,
      otros_antecedentes_pat
    FROM PACIENTE
    WHERE id = ? AND activo = 1
    `,
    [idPaciente]
  );

  return rows[0];
};

export const findCatalogo = async () => {
  const [rows] = await pool.query(`
    SELECT
      id,
      nombre,
      activo
    FROM antecedente_catalogo
    WHERE activo = 1
    ORDER BY id ASC
  `);

  return rows;
};

export const findByPaciente = async (idPaciente) => {
  const [rows] = await pool.query(
    `
    SELECT
      pa.id,
      pa.id_paciente,
      pa.id_antecedente,
      ac.nombre AS antecedente,
      pa.tipo,
      pa.created_at
    FROM paciente_antecedente pa
    INNER JOIN antecedente_catalogo ac
      ON ac.id = pa.id_antecedente
    WHERE pa.id_paciente = ?
    ORDER BY pa.tipo, ac.nombre
    `,
    [idPaciente]
  );

  return rows;
};

export const saveAntecedentesPaciente = async ({
  idPaciente,
  antecedentesFamiliares,
  antecedentesPatologicos,
  otrosAntecedentesFam,
  otrosAntecedentesPat,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      DELETE FROM paciente_antecedente
      WHERE id_paciente = ?
      `,
      [idPaciente]
    );

    for (const idAntecedente of antecedentesFamiliares) {
      await connection.query(
        `
        INSERT INTO paciente_antecedente (
          id_paciente,
          id_antecedente,
          tipo
        ) VALUES (?, ?, 'FAMILIAR')
        `,
        [idPaciente, idAntecedente]
      );
    }

    for (const idAntecedente of antecedentesPatologicos) {
      await connection.query(
        `
        INSERT INTO paciente_antecedente (
          id_paciente,
          id_antecedente,
          tipo
        ) VALUES (?, ?, 'PATOLOGICO')
        `,
        [idPaciente, idAntecedente]
      );
    }

    await connection.query(
      `
      UPDATE PACIENTE
      SET
        otros_antecedentes_fam = ?,
        otros_antecedentes_pat = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [otrosAntecedentesFam, otrosAntecedentesPat, idPaciente]
    );

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};