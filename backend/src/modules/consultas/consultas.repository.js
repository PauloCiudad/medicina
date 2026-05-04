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
      sexo,
      alergias
    FROM PACIENTE
    WHERE id = ? AND activo = 1
    `,
    [idPaciente]
  );

  return rows[0];
};

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      c.id,
      c.id_paciente,
      p.DNI,
      CONCAT_WS(' ', p.nombre, p.nombre_2, p.apellido_pat, p.apellido_mat) AS paciente,
      c.diagnostico,
      cie.codigo AS diagnostico_codigo,
      cie.descripcion AS diagnostico_descripcion,
      c.medicacion,
      c.activo,
      c.motivo_consulta,
      c.fecha_atencion,
      c.created_at,
      c.updated_at
    FROM consulta c
    INNER JOIN PACIENTE p
      ON p.id = c.id_paciente
    LEFT JOIN cie10 cie
      ON cie.id = c.diagnostico
    WHERE c.activo = 1
    ORDER BY c.id DESC
  `);

  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.id_paciente,
      p.DNI,
      CONCAT_WS(' ', p.nombre, p.nombre_2, p.apellido_pat, p.apellido_mat) AS paciente,
      c.diagnostico,
      cie.codigo AS diagnostico_codigo,
      cie.descripcion AS diagnostico_descripcion,
      c.medicacion,
      c.activo,
      c.motivo_consulta,
      c.fecha_atencion,
      c.created_at,
      c.updated_at
    FROM consulta c
    INNER JOIN PACIENTE p
      ON p.id = c.id_paciente
    LEFT JOIN cie10 cie
      ON cie.id = c.diagnostico
    WHERE c.id = ? AND c.activo = 1
    `,
    [id]
  );

  return rows[0];
};

export const findByPaciente = async (idPaciente) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.id_paciente,
      c.diagnostico,
      cie.codigo AS diagnostico_codigo,
      cie.descripcion AS diagnostico_descripcion,
      c.medicacion,
      c.motivo_consulta,
      c.fecha_atencion,
      c.created_at,
      c.updated_at
    FROM consulta c
    LEFT JOIN cie10 cie
      ON cie.id = c.diagnostico
    WHERE c.id_paciente = ?
      AND c.activo = 1
    ORDER BY c.id DESC
    `,
    [idPaciente]
  );

  return rows;
};

export const findSignosVitalesByConsulta = async (idConsulta) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      id_consulta,
      peso,
      talla,
      temperatura,
      presion_arterial,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      saturacion_oxigeno,
      created_at
    FROM consulta_signos_vitales
    WHERE id_consulta = ?
    `,
    [idConsulta]
  );

  return rows[0];
};

export const create = async (data) => {
  const {
    id_paciente,
    motivo_consulta,
    diagnostico = null,
    medicacion = 0,
    signos_vitales = null,
  } = data;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      INSERT INTO consulta (
        id_paciente,
        motivo_consulta,
        diagnostico,
        medicacion
      ) VALUES (?, ?, ?, ?)
      `,
      [
        id_paciente,
        motivo_consulta,
        diagnostico,
        medicacion ? 1 : 0,
      ]
    );

    const idConsulta = result.insertId;

    if (signos_vitales) {
      await connection.query(
        `
        INSERT INTO consulta_signos_vitales (
          id_consulta,
          peso,
          talla,
          temperatura,
          presion_arterial,
          frecuencia_cardiaca,
          frecuencia_respiratoria,
          saturacion_oxigeno
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          idConsulta,
          signos_vitales.peso ?? null,
          signos_vitales.talla ?? null,
          signos_vitales.temperatura ?? null,
          signos_vitales.presion_arterial ?? null,
          signos_vitales.frecuencia_cardiaca ?? null,
          signos_vitales.frecuencia_respiratoria ?? null,
          signos_vitales.saturacion_oxigeno ?? null,
        ]
      );
    }

    await connection.commit();

    return {
      id: idConsulta,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const update = async (id, data) => {
  const {
    motivo_consulta = null,
    diagnostico = null,
    medicacion = 0,
    signos_vitales = null,
  } = data;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE consulta
      SET
        motivo_consulta = ?,
        diagnostico = ?,
        medicacion = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        motivo_consulta,
        diagnostico,
        medicacion ? 1 : 0,
        id,
      ]
    );

    if (signos_vitales) {
      const [rows] = await connection.query(
        `
        SELECT id
        FROM consulta_signos_vitales
        WHERE id_consulta = ?
        `,
        [id]
      );

      if (rows.length > 0) {
        await connection.query(
          `
          UPDATE consulta_signos_vitales
          SET
            peso = ?,
            talla = ?,
            temperatura = ?,
            presion_arterial = ?,
            frecuencia_cardiaca = ?,
            frecuencia_respiratoria = ?,
            saturacion_oxigeno = ?
          WHERE id_consulta = ?
          `,
          [
            signos_vitales.peso ?? null,
            signos_vitales.talla ?? null,
            signos_vitales.temperatura ?? null,
            signos_vitales.presion_arterial ?? null,
            signos_vitales.frecuencia_cardiaca ?? null,
            signos_vitales.frecuencia_respiratoria ?? null,
            signos_vitales.saturacion_oxigeno ?? null,
            id,
          ]
        );
      } else {
        await connection.query(
          `
          INSERT INTO consulta_signos_vitales (
            id_consulta,
            peso,
            talla,
            temperatura,
            presion_arterial,
            frecuencia_cardiaca,
            frecuencia_respiratoria,
            saturacion_oxigeno
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            id,
            signos_vitales.peso ?? null,
            signos_vitales.talla ?? null,
            signos_vitales.temperatura ?? null,
            signos_vitales.presion_arterial ?? null,
            signos_vitales.frecuencia_cardiaca ?? null,
            signos_vitales.frecuencia_respiratoria ?? null,
            signos_vitales.saturacion_oxigeno ?? null,
          ]
        );
      }
    }

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const remove = async (id) => {
  await pool.query(
    `
    UPDATE consulta
    SET activo = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id]
  );

  return true;
};