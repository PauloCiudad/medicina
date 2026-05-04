import { useEffect, useMemo, useState } from "react";

import { getMedicamentosRequest } from "../../medicamentos/services/medicamentosService";

import {
  getMovimientosInventarioRequest,
  getMovimientosByMedicamentoRequest,
  registrarEntradaRequest,
  registrarSalidaRequest,
  registrarAjusteRequest,
} from "../services/inventarioService";

const initialForm = {
  id_medicamento: "",
  cantidad: "",
  nuevo_stock: "",
  motivo: "",
  id_consulta: "",
  id_receta: "",
};

export default function InventarioPage() {
  const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");

  const [medicamentos, setMedicamentos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const medicamentoSeleccionado = useMemo(() => {
    return medicamentos.find((item) => Number(item.id) === Number(form.id_medicamento));
  }, [medicamentos, form.id_medicamento]);

  const cargarMedicamentos = async () => {
    const data = await getMedicamentosRequest();
    setMedicamentos(data || []);
  };

  const cargarMovimientos = async () => {
    const data = await getMovimientosInventarioRequest();
    setMovimientos(data || []);
  };

  const cargarMovimientosPorMedicamento = async (idMedicamento) => {
    if (!idMedicamento) {
      await cargarMovimientos();
      return;
    }

    const data = await getMovimientosByMedicamentoRequest(idMedicamento);
    setMovimientos(data.movimientos || []);
  };

  const cargarData = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      await cargarMedicamentos();
      await cargarMovimientos();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar inventario"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    const newForm = {
      ...form,
      [name]: value,
    };

    setForm(newForm);

    if (name === "id_medicamento") {
      try {
        await cargarMovimientosPorMedicamento(value);
      } catch (error) {
        setMensajeError(
          error.response?.data?.message ||
            "Error al cargar movimientos del medicamento"
        );
      }
    }
  };

  const limpiarFormulario = () => {
    setForm(initialForm);
    setMensajeError("");
    setMensajeOk("");
  };

  const cambiarTipoMovimiento = (tipo) => {
    setTipoMovimiento(tipo);
    limpiarFormulario();
  };

  const validarFormulario = () => {
    if (!form.id_medicamento) {
      return "Debe seleccionar un medicamento";
    }

    if (tipoMovimiento === "ENTRADA") {
      if (!form.cantidad || Number(form.cantidad) <= 0) {
        return "La cantidad de entrada debe ser mayor a 0";
      }
    }

    if (tipoMovimiento === "SALIDA") {
      if (!form.cantidad || Number(form.cantidad) <= 0) {
        return "La cantidad de salida debe ser mayor a 0";
      }

      if (
        medicamentoSeleccionado &&
        Number(form.cantidad) > Number(medicamentoSeleccionado.stock)
      ) {
        return `Stock insuficiente. Stock actual: ${medicamentoSeleccionado.stock}`;
      }
    }

    if (tipoMovimiento === "AJUSTE") {
      if (form.nuevo_stock === "" || Number(form.nuevo_stock) < 0) {
        return "El nuevo stock debe ser mayor o igual a 0";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensajeError("");
    setMensajeOk("");

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setMensajeError(errorValidacion);
      return;
    }

    try {
      setLoading(true);

      if (tipoMovimiento === "ENTRADA") {
        await registrarEntradaRequest({
          id_medicamento: Number(form.id_medicamento),
          cantidad: Number(form.cantidad),
          motivo: form.motivo || "Entrada de inventario",
        });

        setMensajeOk("Entrada registrada correctamente");
      }

      if (tipoMovimiento === "SALIDA") {
        await registrarSalidaRequest({
          id_medicamento: Number(form.id_medicamento),
          cantidad: Number(form.cantidad),
          motivo: form.motivo || "Salida de inventario",
          id_consulta: form.id_consulta ? Number(form.id_consulta) : null,
          id_receta: form.id_receta ? Number(form.id_receta) : null,
        });

        setMensajeOk("Salida registrada correctamente");
      }

      if (tipoMovimiento === "AJUSTE") {
        await registrarAjusteRequest({
          id_medicamento: Number(form.id_medicamento),
          nuevo_stock: Number(form.nuevo_stock),
          motivo: form.motivo || "Ajuste de inventario",
        });

        setMensajeOk("Ajuste registrado correctamente");
      }

      const idMedicamentoActual = form.id_medicamento;

      limpiarFormulario();

      await cargarMedicamentos();

      if (idMedicamentoActual) {
        await cargarMovimientosPorMedicamento(idMedicamentoActual);
      } else {
        await cargarMovimientos();
      }
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al registrar movimiento"
      );
    } finally {
      setLoading(false);
    }
  };

  const getTipoClass = (tipo) => {
    if (tipo === "ENTRADA") return "badge badge-ok";
    if (tipo === "SALIDA") return "badge badge-danger";
    if (tipo === "AJUSTE") return "badge badge-warning";

    return "badge badge-muted";
  };

  const totalStock = useMemo(() => {
    return medicamentos.reduce((total, med) => total + Number(med.stock || 0), 0);
  }, [medicamentos]);

  const totalMovimientos = movimientos.length;

  return (
    <section className="page inventario-page">
      <div className="page-header">
        <div>
          <h1>Inventario</h1>
          <p>Control de entradas, salidas y ajustes de medicamentos.</p>
        </div>

        <button className="btn-secondary" onClick={cargarData}>
          Actualizar
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="inventario-summary-grid">
        <div className="summary-card">
          <span>Medicamentos</span>
          <strong>{medicamentos.length}</strong>
        </div>

        <div className="summary-card">
          <span>Stock total</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="summary-card">
          <span>Movimientos</span>
          <strong>{totalMovimientos}</strong>
        </div>
      </div>

      <div className="inventario-grid">
        <form className="card inventario-form-card" onSubmit={handleSubmit}>
          <h2>Registrar movimiento</h2>

          <div className="movement-tabs">
            <button
              type="button"
              className={tipoMovimiento === "ENTRADA" ? "active entrada" : ""}
              onClick={() => cambiarTipoMovimiento("ENTRADA")}
            >
              Entrada
            </button>

            <button
              type="button"
              className={tipoMovimiento === "SALIDA" ? "active salida" : ""}
              onClick={() => cambiarTipoMovimiento("SALIDA")}
            >
              Salida
            </button>

            <button
              type="button"
              className={tipoMovimiento === "AJUSTE" ? "active ajuste" : ""}
              onClick={() => cambiarTipoMovimiento("AJUSTE")}
            >
              Ajuste
            </button>
          </div>

          <div className="form-group full">
            <label>Medicamento *</label>
            <select
              name="id_medicamento"
              value={form.id_medicamento}
              onChange={handleChange}
            >
              <option value="">Seleccione medicamento</option>

              {medicamentos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nombre} - {med.cantidad} | Stock: {med.stock}
                </option>
              ))}
            </select>
          </div>

          {medicamentoSeleccionado && (
            <div className="selected-med-card">
              <span>Medicamento seleccionado</span>
              <strong>
                {medicamentoSeleccionado.nombre} - {medicamentoSeleccionado.cantidad}
              </strong>
              <p>Stock actual: {medicamentoSeleccionado.stock}</p>
            </div>
          )}

          {(tipoMovimiento === "ENTRADA" || tipoMovimiento === "SALIDA") && (
            <div className="form-group full">
              <label>
                {tipoMovimiento === "ENTRADA"
                  ? "Cantidad a ingresar *"
                  : "Cantidad a retirar *"}
              </label>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Ej. 10"
              />
            </div>
          )}

          {tipoMovimiento === "AJUSTE" && (
            <div className="form-group full">
              <label>Nuevo stock *</label>
              <input
                type="number"
                name="nuevo_stock"
                value={form.nuevo_stock}
                onChange={handleChange}
                placeholder="Ej. 100"
              />
            </div>
          )}

          {tipoMovimiento === "SALIDA" && (
            <div className="salida-extra-box">
              <h3>Datos opcionales de la salida</h3>
              <p>
                Puedes asociar esta salida a una consulta o receta. Por ahora se
                puede dejar vacío.
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label>ID Consulta</label>
                  <input
                    type="number"
                    name="id_consulta"
                    value={form.id_consulta}
                    onChange={handleChange}
                    placeholder="Ej. 1"
                  />
                </div>

                <div className="form-group">
                  <label>ID Receta</label>
                  <input
                    type="number"
                    name="id_receta"
                    value={form.id_receta}
                    onChange={handleChange}
                    placeholder="Ej. 1"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-group full">
            <label>Motivo</label>
            <textarea
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              placeholder={
                tipoMovimiento === "ENTRADA"
                  ? "Ej. Ingreso inicial de medicamentos"
                  : tipoMovimiento === "SALIDA"
                  ? "Ej. Entrega al paciente"
                  : "Ej. Corrección por conteo físico"
              }
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : tipoMovimiento === "ENTRADA"
                ? "Registrar entrada"
                : tipoMovimiento === "SALIDA"
                ? "Registrar salida"
                : "Registrar ajuste"}
            </button>

            <button type="button" className="btn-light" onClick={limpiarFormulario}>
              Limpiar
            </button>
          </div>
        </form>

        <div className="card movimientos-card">
          <div className="list-card-header">
            <div>
              <h2>Movimientos de inventario</h2>
              <p>
                {form.id_medicamento
                  ? "Mostrando movimientos del medicamento seleccionado."
                  : "Mostrando todos los movimientos registrados."}
              </p>
            </div>

            {form.id_medicamento && (
              <button className="btn-light" onClick={cargarMovimientos}>
                Ver todos
              </button>
            )}
          </div>

          {loading && <p>Cargando...</p>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicamento</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Consulta</th>
                  <th>Receta</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan="8">No hay movimientos registrados.</td>
                  </tr>
                ) : (
                  movimientos.map((mov) => (
                    <tr key={mov.id}>
                      <td>{mov.id}</td>
                      <td>
                        <strong>{mov.medicamento}</strong>
                        <br />
                        <small>{mov.medicamento_cantidad}</small>
                      </td>
                      <td>
                        <span className={getTipoClass(mov.tipo_movimiento)}>
                          {mov.tipo_movimiento}
                        </span>
                      </td>
                      <td>{mov.cantidad}</td>
                      <td>{mov.motivo || "-"}</td>
                      <td>{mov.id_consulta || "-"}</td>
                      <td>{mov.id_receta || "-"}</td>
                      <td>
                        {mov.fecha_movimiento
                          ? new Date(mov.fecha_movimiento).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}