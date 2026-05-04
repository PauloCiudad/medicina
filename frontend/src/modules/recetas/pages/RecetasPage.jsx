import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRecetasRequest,
  deleteRecetaRequest,
} from "../services/recetasService";

export default function RecetasPage() {
  const navigate = useNavigate();

  const [recetas, setRecetas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEntrega, setFiltroEntrega] = useState("TODAS");

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const data = await getRecetasRequest();
      setRecetas(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar recetas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  const recetasFiltradas = useMemo(() => {
    let result = [...recetas];

    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();

      result = result.filter((receta) => {
        const paciente = receta.paciente?.toLowerCase() || "";
        const dni = String(receta.DNI || "").toLowerCase();
        const medicamento = receta.medicamento?.toLowerCase() || "";
        const dosis = receta.dosis?.toLowerCase() || "";
        const frecuencia = receta.frecuencia?.toLowerCase() || "";
        const indicaciones = receta.indicaciones?.toLowerCase() || "";

        return (
          paciente.includes(texto) ||
          dni.includes(texto) ||
          medicamento.includes(texto) ||
          dosis.includes(texto) ||
          frecuencia.includes(texto) ||
          indicaciones.includes(texto)
        );
      });
    }

    if (filtroEntrega === "ENTREGADAS") {
      result = result.filter(
        (receta) => Number(receta.cantidad_entregada || 0) > 0
      );
    }

    if (filtroEntrega === "NO_ENTREGADAS") {
      result = result.filter(
        (receta) => Number(receta.cantidad_entregada || 0) === 0
      );
    }

    return result;
  }, [recetas, busqueda, filtroEntrega]);

  const totalRecetas = recetas.length;

  const recetasEntregadas = useMemo(() => {
    return recetas.filter((item) => Number(item.cantidad_entregada || 0) > 0)
      .length;
  }, [recetas]);

  const recetasNoEntregadas = useMemo(() => {
    return recetas.filter((item) => Number(item.cantidad_entregada || 0) === 0)
      .length;
  }, [recetas]);

  const cantidadTotalEntregada = useMemo(() => {
    return recetas.reduce((total, item) => {
      return total + Number(item.cantidad_entregada || 0);
    }, 0);
  }, [recetas]);

  const handleEliminar = async (idReceta) => {
    const confirmar = window.confirm(
      "¿Deseas eliminar esta receta? Recuerda que si ya descontó stock, el movimiento de inventario quedará registrado."
    );

    if (!confirmar) return;

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await deleteRecetaRequest(idReceta);

      setMensajeOk("Receta eliminada correctamente");
      await cargarRecetas();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al eliminar receta"
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEntrega("TODAS");
  };

  return (
    <section className="page recetas-general-page">
      <div className="page-header">
        <div>
          <h1>Recetas médicas</h1>
          <p>Listado general de recetas registradas en el sistema.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn-light" onClick={cargarRecetas}>
            Actualizar
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/consultas")}
          >
            Ver consultas
          </button>
        </div>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="recetas-summary-grid">
        <div className="summary-card">
          <span>Total recetas</span>
          <strong>{totalRecetas}</strong>
        </div>

        <div className="summary-card">
          <span>Con entrega</span>
          <strong>{recetasEntregadas}</strong>
        </div>

        <div className="summary-card">
          <span>Sin entrega</span>
          <strong>{recetasNoEntregadas}</strong>
        </div>

        <div className="summary-card">
          <span>Cantidad entregada</span>
          <strong>{cantidadTotalEntregada}</strong>
        </div>
      </div>

      <div className="card recetas-filter-card">
        <div className="consultas-filter-header">
          <div>
            <h2>Buscar recetas</h2>
            <p>Filtra por paciente, DNI, medicamento, dosis o indicaciones.</p>
          </div>
        </div>

        <div className="recetas-toolbar">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar receta..."
          />

          <select
            value={filtroEntrega}
            onChange={(e) => setFiltroEntrega(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="ENTREGADAS">Con medicamento entregado</option>
            <option value="NO_ENTREGADAS">Sin medicamento entregado</option>
          </select>

          <button type="button" className="btn-light" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="card recetas-general-list-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Registro de recetas</h2>
            <p>Recetas ordenadas desde la más reciente.</p>
          </div>
        </div>

        {loading && <p>Cargando...</p>}

        <div className="recetas-general-list">
          {recetasFiltradas.length === 0 ? (
            <div className="empty-box">
              No hay recetas que coincidan con los filtros.
            </div>
          ) : (
            recetasFiltradas.map((receta) => (
              <div className="receta-general-card" key={receta.id}>
                <div className="receta-general-header">
                  <div>
                    <h3>{receta.medicamento || "Medicamento"}</h3>
                    <p>
                      {receta.medicamento_cantidad || "-"} | Receta #{receta.id}
                    </p>
                  </div>

                  <span
                    className={
                      Number(receta.cantidad_entregada || 0) > 0
                        ? "badge badge-ok"
                        : "badge badge-muted"
                    }
                  >
                    {Number(receta.cantidad_entregada || 0) > 0
                      ? "Stock descontado"
                      : "Sin entrega"}
                  </span>
                </div>

                <div className="receta-paciente-box">
                  <span>Paciente</span>
                  <strong>{receta.paciente || "-"}</strong>
                  <small>DNI: {receta.DNI || "-"}</small>
                </div>

                <div className="receta-general-details">
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
                    <span>Fecha</span>
                    <strong>
                      {receta.created_at
                        ? new Date(receta.created_at).toLocaleString()
                        : "-"}
                    </strong>
                  </div>
                </div>

                {receta.indicaciones && (
                  <div className="receta-general-indicaciones">
                    <span>Indicaciones</span>
                    <p>{receta.indicaciones}</p>
                  </div>
                )}

                <div className="receta-general-footer">
                  <div>
                    <span>Consulta relacionada</span>
                    <strong>Consulta #{receta.id_consulta}</strong>
                  </div>

                  <div className="table-actions">
                    <button
                      className="btn-small"
                      onClick={() =>
                        navigate(`/pacientes/${receta.id_paciente}/consultas`)
                      }
                    >
                      Historial
                    </button>

                    <button
                      className="btn-small"
                      onClick={() =>
                        navigate(`/consultas/${receta.id_consulta}/recetas`)
                      }
                    >
                      Ver consulta
                    </button>

                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleEliminar(receta.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}