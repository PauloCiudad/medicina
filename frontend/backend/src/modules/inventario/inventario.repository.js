import { pool } from "../../config/db.js";

export const findMedicamentoById = async (idMedicamento) => {
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
    [idMedicamento]
  );

  return rows[0];
};

export const findRecetaById = async (idReceta) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      id_consulta,
      id_medicamento,
      dosis,
      frecuencia,
      duracion,
      via_administracion,
      cantidad_entregada,
      indicaciones,
      activo
    FROM receta
    WHERE id = ?
      AND activo = 1
    `,
    [idReceta]
  );

  return rows[0];
};

export const findAllMovimientos = async () => {
  const [rows] = await pool.query(`
    SELECT
      im.id,
      im.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      im.id_consulta,
      im.id_receta,
      im.tipo_movimiento,
      im.cantidad,
      im.motivo,
      im.fecha_movimiento
    FROM inventario_movimiento im
    INNER JOIN medicamento m
      ON m.id = im.id_medicamento
    ORDER BY im.fecha_movimiento DESC, im.id DESC
  `);

  return rows;
};

export const findMovimientosByMedicamento = async (idMedicamento) => {
  const [rows] = await pool.query(
    `
    SELECT
      im.id,
      im.id_medicamento,
      m.nombre AS medicamento,
      m.cantidad AS medicamento_cantidad,
      im.id_consulta,
      im.id_receta,
      im.tipo_movimiento,
      im.cantidad,
      im.motivo,
      im.fecha_movimiento
    FROM inventario_movimiento im
    INNER JOIN medicamento m
      ON m.id = im.id_medicamento
    WHERE im.id_medicamento = ?
    ORDER BY im.fecha_movimiento DESC, im.id DESC
    `,
    [idMedicamento]
  );

  return rows;
};

export const registrarMovimientoEntrada = async ({
  idMedicamento,
  cantidad,
  motivo,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE medicamento
      SET
        stock = stock + ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [cantidad, idMedicamento]
    );

    await connection.query(
      `
      INSERT INTO inventario_movimiento (
        id_medicamento,
        tipo_movimiento,
        cantidad,
        motivo
      ) VALUES (?, 'ENTRADA', ?, ?)
      `,
      [idMedicamento, cantidad, motivo]
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

export const registrarMovimientoSalida = async ({
  idMedicamento,
  cantidad,
  motivo,
  idConsulta,
  idReceta,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [medicamentos] = await connection.query(
      `
      SELECT id, stock
      FROM medicamento
      WHERE id = ?
        AND activo = 1
      FOR UPDATE
      `,
      [idMedicamento]
    );

    const medicamento = medicamentos[0];

    if (!medicamento) {
      const error = new Error("Medicamento no encontrado");
      error.status = 404;
      throw error;
    }

    if (Number(medicamento.stock) < cantidad) {
      const error = new Error(
        `Stock insuficiente. Stock actual: ${medicamento.stock}`
      );
      error.status = 400;
      throw error;
    }

    await connection.query(
      `
      UPDATE medicamento
      SET
        stock = stock - ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [cantidad, idMedicamento]
    );

    await connection.query(
      `
      INSERT INTO inventario_movimiento (
        id_medicamento,
        id_consulta,
        id_receta,
        tipo_movimiento,
        cantidad,
        motivo
      ) VALUES (?, ?, ?, 'SALIDA', ?, ?)
      `,
      [
        idMedicamento,
        idConsulta,
        idReceta,
        cantidad,
        motivo,
      ]
    );

    if (idReceta) {
      await connection.query(
        `
        UPDATE receta
        SET
          cantidad_entregada = COALESCE(cantidad_entregada, 0) + ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [cantidad, idReceta]
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

export const registrarMovimientoAjuste = async ({
  idMedicamento,
  stockAnterior,
  nuevoStock,
  diferencia,
  motivo,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE medicamento
      SET
        stock = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [nuevoStock, idMedicamento]
    );

    await connection.query(
      `
      INSERT INTO inventario_movimiento (
        id_medicamento,
        tipo_movimiento,
        cantidad,
        motivo
      ) VALUES (?, 'AJUSTE', ?, ?)
      `,
      [
        idMedicamento,
        Math.abs(diferencia),
        `${motivo}. Stock anterior: ${stockAnterior}. Nuevo stock: ${nuevoStock}. Diferencia: ${diferencia}`,
      ]
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