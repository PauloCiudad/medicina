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

export const findConsultaById = async (idConsulta) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.id_paciente,
      p.DNI,
      CONCAT_WS(' ', p.nombre, p.nombre_2, p.apellido_pat, p.apellido_mat) AS paciente,
      c.diagnostico,
      c.medicacion,
      c.created_at
    FROM consulta c
    INNER JOIN PACIENTE p
      ON p.id = c.id_paciente
    WHERE c.id = ?
      AND c.activo = 1
    `,
    [idConsulta]
  );

  return rows[0];
};

export const findMedicamentoById = async (idMedicamento) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      cantidad,
      stock,
      activo
    FROM medicamento
    WHERE id = ?
      AND activo = 1
    `,
    [idMedicamento]
  );

  return rows[0];
};

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      r.id,
      r.id_consulta,
      c.id_paciente,
      p.DNI,
      CONCAT_WS(' ', p.nombre, p.nombre_2, p.apellido_pat, p.apellido_mat) AS paciente,
      r.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      r.dosis,
      r.frecuencia,
      r.duracion,
      r.via_administracion,
      r.cantidad_entregada,
      r.indicaciones,
      r.activo,
      r.created_at,
      r.updated_at
    FROM receta r
    INNER JOIN consulta c
      ON c.id = r.id_consulta
    INNER JOIN PACIENTE p
      ON p.id = c.id_paciente
    INNER JOIN medicamento m
      ON m.id = r.id_medicamento
    WHERE r.activo = 1
    ORDER BY r.id DESC
  `);

  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      r.id,
      r.id_consulta,
      c.id_paciente,
      p.DNI,
      CONCAT_WS(' ', p.nombre, p.nombre_2, p.apellido_pat, p.apellido_mat) AS paciente,
      r.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      m.stock AS stock_actual,
      r.dosis,
      r.frecuencia,
      r.duracion,
      r.via_administracion,
      r.cantidad_entregada,
      r.indicaciones,
      r.activo,
      r.created_at,
      r.updated_at
    FROM receta r
    INNER JOIN consulta c
      ON c.id = r.id_consulta
    INNER JOIN PACIENTE p
      ON p.id = c.id_paciente
    INNER JOIN medicamento m
      ON m.id = r.id_medicamento
    WHERE r.id = ?
      AND r.activo = 1
    `,
    [id]
  );

  return rows[0];
};

export const findByConsulta = async (idConsulta) => {
  const [rows] = await pool.query(
    `
    SELECT
      r.id,
      r.id_consulta,
      r.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      m.stock AS stock_actual,
      r.dosis,
      r.frecuencia,
      r.duracion,
      r.via_administracion,
      r.cantidad_entregada,
      r.indicaciones,
      r.created_at,
      r.updated_at
    FROM receta r
    INNER JOIN medicamento m
      ON m.id = r.id_medicamento
    WHERE r.id_consulta = ?
      AND r.activo = 1
    ORDER BY r.id ASC
    `,
    [idConsulta]
  );

  return rows;
};

export const findByPaciente = async (idPaciente) => {
  const [rows] = await pool.query(
    `
    SELECT
      r.id,
      r.id_consulta,
      c.id_paciente,
      r.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      r.dosis,
      r.frecuencia,
      r.duracion,
      r.via_administracion,
      r.cantidad_entregada,
      r.indicaciones,
      r.created_at,
      r.updated_at
    FROM receta r
    INNER JOIN consulta c
      ON c.id = r.id_consulta
    INNER JOIN medicamento m
      ON m.id = r.id_medicamento
    WHERE c.id_paciente = ?
      AND r.activo = 1
      AND c.activo = 1
    ORDER BY r.id DESC
    `,
    [idPaciente]
  );

  return rows;
};

export const create = async (data, idUsuario = null) => {
  const {
    id_consulta,
    id_medicamento,
    dosis,
    frecuencia = null,
    duracion = null,
    via_administracion = null,
    cantidad_entregada = 0,
    indicaciones = null,
  } = data;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cantidadEntregadaNumerica = Number(cantidad_entregada || 0);

    const [medicamentos] = await connection.query(
      `
      SELECT
        id,
        nombre,
        cantidad,
        stock
      FROM medicamento
      WHERE id = ?
        AND activo = 1
      FOR UPDATE
      `,
      [id_medicamento]
    );

    const medicamento = medicamentos[0];

    if (!medicamento) {
      const error = new Error("Medicamento no encontrado");
      error.status = 404;
      throw error;
    }

    if (cantidadEntregadaNumerica > Number(medicamento.stock)) {
      const error = new Error(
        `Stock insuficiente. Stock actual: ${medicamento.stock}`
      );
      error.status = 400;
      throw error;
    }

    const [result] = await connection.query(
      `
      INSERT INTO receta (
        id_consulta,
        id_medicamento,
        dosis,
        frecuencia,
        duracion,
        via_administracion,
        cantidad_entregada,
        indicaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id_consulta,
        id_medicamento,
        dosis,
        frecuencia,
        duracion,
        via_administracion,
        cantidadEntregadaNumerica,
        indicaciones,
      ]
    );

    const idReceta = result.insertId;

    if (cantidadEntregadaNumerica > 0) {
      await connection.query(
        `
        UPDATE medicamento
        SET
          stock = stock - ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [cantidadEntregadaNumerica, id_medicamento]
      );

      await connection.query(
        `
        INSERT INTO inventario_movimiento (
          id_medicamento,
          id_usuario,
          id_consulta,
          id_receta,
          tipo_movimiento,
          cantidad,
          motivo
        ) VALUES (?, ?, ?, ?, 'SALIDA', ?, ?)
        `,
        [
          id_medicamento,
          idUsuario,
          id_consulta,
          idReceta,
          cantidadEntregadaNumerica,
          "Salida automática por receta médica",
        ]
      );
    }

    await connection.commit();

    return {
      id: idReceta,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const createBatch = async (idConsulta, medicamentos) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of medicamentos) {
      await connection.query(
        `
        INSERT INTO receta (
          id_consulta,
          id_medicamento,
          dosis,
          frecuencia,
          duracion,
          via_administracion,
          cantidad_entregada,
          indicaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          idConsulta,
          item.id_medicamento,
          item.dosis,
          item.frecuencia ?? null,
          item.duracion ?? null,
          item.via_administracion ?? null,
          item.cantidad_entregada ?? 0,
          item.indicaciones ?? null,
        ]
      );
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

export const update = async (id, data) => {
  const {
    id_medicamento,
    dosis,
    frecuencia,
    duracion,
    via_administracion,
    cantidad_entregada,
    indicaciones,
  } = data;

  await pool.query(
    `
    UPDATE receta
    SET
      id_medicamento = COALESCE(?, id_medicamento),
      dosis = COALESCE(?, dosis),
      frecuencia = ?,
      duracion = ?,
      via_administracion = ?,
      cantidad_entregada = COALESCE(?, cantidad_entregada),
      indicaciones = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      id_medicamento ?? null,
      dosis ?? null,
      frecuencia ?? null,
      duracion ?? null,
      via_administracion ?? null,
      cantidad_entregada ?? null,
      indicaciones ?? null,
      id,
    ]
  );

  return true;
};

export const remove = async (id) => {
  await pool.query(
    `
    UPDATE receta
    SET activo = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id]
  );

  return true;
};