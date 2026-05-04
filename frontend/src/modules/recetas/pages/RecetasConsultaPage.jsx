import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getConsultaByIdRequest } from "../../consultas/services/consultasService";
import { getMedicamentosRequest } from "../../medicamentos/services/medicamentosService";

import {
  getRecetasByConsultaRequest,
  createRecetaRequest,
  deleteRecetaRequest,
} from "../services/recetasService";

const initialForm = {
  id_medicamento: "",
  dosis: "",
  frecuencia: "",
  duracion: "",
  via_administracion: "Oral",
  cantidad_entregada: 0,
  indicaciones: "",
};

export default function RecetasConsultaPage() {
  const { idConsulta } = useParams();
  const navigate = useNavigate();

  const [consulta, setConsulta] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarData = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const consultaData = await getConsultaByIdRequest(idConsulta);
      const recetasData = await getRecetasByConsultaRequest(idConsulta);
      const medicamentosData = await getMedicamentosRequest();

      setConsulta(consultaData);
      setRecetas(recetasData.recetas || []);
      setMedicamentos(medicamentosData || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar recetas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, [idConsulta]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setForm(initialForm);
  };

  const validarFormulario = () => {
    if (!form.id_medicamento) {
      return "Debe seleccionar un medicamento";
    }

    if (!form.dosis.trim()) {
      return "La dosis es obligatoria";
    }

    if (!form.frecuencia.trim()) {
      return "La frecuencia es obligatoria";
    }

    if (!form.duracion.trim()) {
      return "La duración es obligatoria";
    }

    if (Number(form.cantidad_entregada) < 0) {
      return "La cantidad entregada no puede ser negativa";
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

      await createRecetaRequest({
        id_consulta: Number(idConsulta),
        id_medicamento: Number(form.id_medicamento),
        dosis: form.dosis.trim(),
        frecuencia: form.frecuencia.trim(),
        duracion: form.duracion.trim(),
        via_administracion: form.via_administracion || null,
        cantidad_entregada: Number(form.cantidad_entregada || 0),
        indicaciones: form.indicaciones || null,
      });

      setMensajeOk("Receta registrada correctamente");
      limpiarFormulario();
      await cargarData();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al registrar receta"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idReceta) => {
    const confirmar = window.confirm("¿Deseas eliminar esta receta?");

    if (!confirmar) return;

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await deleteRecetaRequest(idReceta);

      setMensajeOk("Receta eliminada correctamente");
      await cargarData();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al eliminar receta"
      );
    } finally {
      setLoading(false);
    }
  };

  const idPaciente = consulta?.id_paciente;
  const permiteReceta = Number(consulta?.medicacion) === 1;

  return (
    <section className="page recetas-page">
      <div className="page-header">
        <div>
          <h1>Recetas de la consulta</h1>
          <p>
            {consulta
              ? `${consulta.paciente} - DNI: ${consulta.DNI || "-"}`
              : "Cargando consulta..."}
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-light"
            onClick={() => navigate(`/pacientes/${idPaciente}/consultas`)}
          >
            Volver a consultas
          </button>
        </div>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="local-actions">
        <button
            type="button"
            className="btn-light"
            onClick={() => navigate(`/pacientes/${idPaciente}/consultas`)}
        >
            Volver a consultas
        </button>
      </div>

      {consulta && (
        <div className="consulta-summary-card">
          <div>
            <span>Motivo de consulta</span>
            <strong>{consulta.motivo_consulta || "-"}</strong>
          </div>

          <div>
            <span>Medicación</span>
            <strong>
              {permiteReceta ? "Sí requiere medicación" : "No requiere medicación"}
            </strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>
              {consulta.created_at
                ? new Date(consulta.created_at).toLocaleString()
                : "-"}
            </strong>
          </div>
        </div>
      )}

      {!permiteReceta && consulta && (
        <div className="alert alert-error">
          Esta consulta está marcada como “Sin medicación”. Para registrar una
          receta, primero edita la consulta y cambia medicación a “Sí”.
        </div>
      )}

      <div className="recetas-grid">
        <form className="card receta-form-card" onSubmit={handleSubmit}>
          <h2>Nueva receta</h2>

          <div className="form-group full">
            <label>Medicamento *</label>
            <select
              name="id_medicamento"
              value={form.id_medicamento}
              onChange={handleChange}
              disabled={!permiteReceta}
            >
              <option value="">Seleccione medicamento</option>

              {medicamentos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nombre} - {med.cantidad} | Stock: {med.stock}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Dosis *</label>
              <input
                name="dosis"
                value={form.dosis}
                onChange={handleChange}
                placeholder="Ej. 1 tableta"
                disabled={!permiteReceta}
              />
            </div>

            <div className="form-group">
              <label>Frecuencia *</label>
              <input
                name="frecuencia"
                value={form.frecuencia}
                onChange={handleChange}
                placeholder="Ej. Cada 8 horas"
                disabled={!permiteReceta}
              />
            </div>

            <div className="form-group">
              <label>Duración *</label>
              <input
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                placeholder="Ej. 3 días"
                disabled={!permiteReceta}
              />
            </div>

            <div className="form-group">
              <label>Vía</label>
              <select
                name="via_administracion"
                value={form.via_administracion}
                onChange={handleChange}
                disabled={!permiteReceta}
              >
                <option value="Oral">Oral</option>
                <option value="Intramuscular">Intramuscular</option>
                <option value="Intravenosa">Intravenosa</option>
                <option value="Tópica">Tópica</option>
                <option value="Oftálmica">Oftálmica</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cantidad entregada / descontar stock</label>
              <input
                type="number"
                name="cantidad_entregada"
                value={form.cantidad_entregada}
                onChange={handleChange}
                disabled={!permiteReceta}
                placeholder="Ej. 6"
              />
            </div>
          </div>

          <div className="form-group full">
            <label>Indicaciones</label>
            <textarea
              name="indicaciones"
              value={form.indicaciones}
              onChange={handleChange}
              placeholder="Ej. Tomar después de los alimentos"
              disabled={!permiteReceta}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading || !permiteReceta}>
              {loading ? "Guardando..." : "Agregar receta"}
            </button>

            <button
              type="button"
              className="btn-light"
              onClick={limpiarFormulario}
              disabled={!permiteReceta}
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="card recetas-list-card">
          <h2>Medicamentos recetados</h2>

          {loading && <p>Cargando...</p>}

          {recetas.length === 0 ? (
            <p>No hay recetas registradas para esta consulta.</p>
          ) : (
            <div className="receta-list">
              {recetas.map((receta) => (
                <div className="receta-item" key={receta.id}>
                  <div className="receta-item-header">
                    <div>
                      <h3>{receta.medicamento}</h3>
                      <span>{receta.medicamento_cantidad}</span>
                    </div>

                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleEliminar(receta.id)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="receta-details-grid">
                    <div>
                      <span>Dosis</span>
                      <strong>{receta.dosis || "-"}</strong>
                    </div>

                    <div>
                      <span>Frecuencia</span>
                      <strong>{receta.frecuencia || "-"}</strong>
                    </div>

                    <div>
                      <span>Duración</span>
                      <strong>{receta.duracion || "-"}</strong>
                    </div>

                    <div>
                      <span>Vía</span>
                      <strong>{receta.via_administracion || "-"}</strong>
                    </div>

                    <div>
                      <span>Cantidad entregada</span>
                      <strong>{receta.cantidad_entregada || 0}</strong>
                    </div>

                    <div>
                      <span>Stock actual</span>
                      <strong>{receta.stock_actual ?? "-"}</strong>
                    </div>
                  </div>

                  {receta.indicaciones && (
                    <div className="receta-indicaciones">
                      <span>Indicaciones</span>
                      <p>{receta.indicaciones}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}