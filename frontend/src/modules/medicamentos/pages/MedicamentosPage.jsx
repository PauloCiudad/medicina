import { useEffect, useMemo, useState } from "react";

import {
  getMedicamentosRequest,
  searchMedicamentosRequest,
  createMedicamentoRequest,
  updateMedicamentoRequest,
  deleteMedicamentoRequest,
  getMedicamentosStockBajoRequest,
} from "../services/medicamentosService";

const initialForm = {
  nombre: "",
  cantidad: "",
  stock: 0,
};

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [limiteStock, setLimiteStock] = useState(10);

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const totalMedicamentos = medicamentos.length;

  const totalStock = useMemo(() => {
    return medicamentos.reduce((total, item) => {
      return total + Number(item.stock || 0);
    }, 0);
  }, [medicamentos]);

  const medicamentosSinStock = useMemo(() => {
    return medicamentos.filter((item) => Number(item.stock) === 0).length;
  }, [medicamentos]);

  const cargarMedicamentos = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const data = await getMedicamentosRequest();
      setMedicamentos(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar medicamentos"
      );
    } finally {
      setLoading(false);
    }
  };

  const cargarStockBajo = async () => {
    try {
      const data = await getMedicamentosStockBajoRequest(limiteStock);
      setStockBajo(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar stock bajo"
      );
    }
  };

  const cargarData = async () => {
    await cargarMedicamentos();
    await cargarStockBajo();
  };

  useEffect(() => {
    cargarData();
  }, []);

  useEffect(() => {
    cargarStockBajo();
  }, [limiteStock]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setForm(initialForm);
    setEditandoId(null);
    setMensajeError("");
    setMensajeOk("");
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      return "El nombre del medicamento es obligatorio";
    }

    if (!form.cantidad.trim()) {
      return "La cantidad o presentación es obligatoria";
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      return "El stock debe ser mayor o igual a 0";
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

      const payload = {
        nombre: form.nombre.trim(),
        cantidad: form.cantidad.trim(),
        stock: Number(form.stock || 0),
      };

      if (editandoId) {
        await updateMedicamentoRequest(editandoId, payload);
        setMensajeOk("Medicamento actualizado correctamente");
      } else {
        await createMedicamentoRequest(payload);
        setMensajeOk("Medicamento registrado correctamente");
      }

      limpiarFormulario();
      await cargarData();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al guardar medicamento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (medicamento) => {
    setEditandoId(medicamento.id);

    setForm({
      nombre: medicamento.nombre || "",
      cantidad: medicamento.cantidad || "",
      stock: medicamento.stock ?? 0,
    });

    setMensajeError("");
    setMensajeOk("");
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este medicamento?");

    if (!confirmar) return;

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await deleteMedicamentoRequest(id);

      setMensajeOk("Medicamento eliminado correctamente");
      await cargarData();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al eliminar medicamento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMensajeError("");

      if (!busqueda.trim()) {
        await cargarMedicamentos();
        return;
      }

      const data = await searchMedicamentosRequest(busqueda.trim());
      setMedicamentos(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al buscar medicamentos"
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = async () => {
    setBusqueda("");
    await cargarMedicamentos();
  };

  const getStockClass = (stock) => {
    const value = Number(stock);

    if (value === 0) return "stock-pill stock-zero";
    if (value <= Number(limiteStock)) return "stock-pill stock-low";

    return "stock-pill stock-ok";
  };

  return (
    <section className="page medicamentos-page">
      <div className="page-header">
        <div>
          <h1>Medicamentos</h1>
          <p>Catálogo de medicamentos, presentaciones y stock actual.</p>
        </div>

        <button className="btn-secondary" onClick={cargarData}>
          Actualizar
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="medicamentos-summary-grid">
        <div className="summary-card">
          <span>Total medicamentos</span>
          <strong>{totalMedicamentos}</strong>
        </div>

        <div className="summary-card">
          <span>Stock total</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="summary-card">
          <span>Sin stock</span>
          <strong>{medicamentosSinStock}</strong>
        </div>

        <div className="summary-card">
          <span>Stock bajo</span>
          <strong>{stockBajo.length}</strong>
        </div>
      </div>

      <div className="medicamentos-grid">
        <form className="card medicamento-form-card" onSubmit={handleSubmit}>
          <h2>{editandoId ? "Editar medicamento" : "Nuevo medicamento"}</h2>

          <div className="form-group full">
            <label>Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Paracetamol"
            />
          </div>

          <div className="form-group full">
            <label>Cantidad / presentación *</label>
            <input
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Ej. 500 mg, 250 mg/5 ml, frasco 120 ml"
            />
          </div>

          <div className="form-group full">
            <label>Stock inicial</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Ej. 50"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : editandoId
                ? "Actualizar"
                : "Registrar"}
            </button>

            {editandoId && (
              <button type="button" className="btn-light" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>

          <div className="helper-box">
            <strong>Nota:</strong>
            <p>
              Este formulario registra el medicamento y su stock inicial. Las
              entradas, salidas y ajustes se manejarán desde Inventario.
            </p>
          </div>
        </form>

        <div className="card medicamentos-list-card">
          <div className="list-card-header">
            <div>
              <h2>Listado de medicamentos</h2>
              <p>Busca por nombre, presentación o concentración.</p>
            </div>
          </div>

          <form className="search-bar" onSubmit={handleBuscar}>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar medicamento..."
            />

            <button type="submit">Buscar</button>

            <button type="button" className="btn-light" onClick={limpiarBusqueda}>
              Limpiar
            </button>
          </form>

          {loading && <p>Cargando...</p>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicamento</th>
                  <th>Presentación</th>
                  <th>Stock</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {medicamentos.length === 0 ? (
                  <tr>
                    <td colSpan="6">No hay medicamentos registrados.</td>
                  </tr>
                ) : (
                  medicamentos.map((med) => (
                    <tr key={med.id}>
                      <td>{med.id}</td>
                      <td>
                        <strong>{med.nombre}</strong>
                      </td>
                      <td>{med.cantidad}</td>
                      <td>
                        <span className={getStockClass(med.stock)}>
                          {med.stock}
                        </span>
                      </td>
                      <td>
                        {med.created_at
                          ? new Date(med.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-small"
                            onClick={() => handleEditar(med)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleEliminar(med.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card stock-bajo-card">
        <div className="stock-bajo-header">
          <div>
            <h2>Medicamentos con stock bajo</h2>
            <p>Medicamentos con stock menor o igual al límite definido.</p>
          </div>

          <div className="stock-limit-control">
            <label>Límite</label>
            <input
              type="number"
              value={limiteStock}
              onChange={(e) => setLimiteStock(e.target.value)}
            />
          </div>
        </div>

        {stockBajo.length === 0 ? (
          <p>No hay medicamentos con stock bajo.</p>
        ) : (
          <div className="stock-bajo-list">
            {stockBajo.map((med) => (
              <div className="stock-bajo-item" key={med.id}>
                <div>
                  <strong>{med.nombre}</strong>
                  <span>{med.cantidad}</span>
                </div>

                <span className={getStockClass(med.stock)}>
                  Stock: {med.stock}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}