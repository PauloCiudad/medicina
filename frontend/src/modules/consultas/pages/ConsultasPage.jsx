import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getConsultasRequest,
  deleteConsultaRequest,
} from "../services/consultasService";

export default function ConsultasPage() {
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMedicacion, setFiltroMedicacion] = useState("TODAS");

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const data = await getConsultasRequest();
      setConsultas(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar consultas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const consultasFiltradas = useMemo(() => {
    let result = [...consultas];

    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();

      result = result.filter((consulta) => {
        const paciente = consulta.paciente?.toLowerCase() || "";
        const dni = String(consulta.DNI || "").toLowerCase();
        const motivo = consulta.motivo_consulta?.toLowerCase() || "";
        const diagnostico =
          consulta.diagnostico_descripcion?.toLowerCase() || "";

        return (
          paciente.includes(texto) ||
          dni.includes(texto) ||
          motivo.includes(texto) ||
          diagnostico.includes(texto)
        );
      });
    }

    if (filtroMedicacion === "CON_MEDICACION") {
      result = result.filter((consulta) => Number(consulta.medicacion) === 1);
    }

    if (filtroMedicacion === "SIN_MEDICACION") {
      result = result.filter((consulta) => Number(consulta.medicacion) === 0);
    }

    return result;
  }, [consultas, busqueda, filtroMedicacion]);

  const totalConsultas = consultas.length;

  const totalConMedicacion = useMemo(() => {
    return consultas.filter((consulta) => Number(consulta.medicacion) === 1)
      .length;
  }, [consultas]);

  const totalSinMedicacion = useMemo(() => {
    return consultas.filter((consulta) => Number(consulta.medicacion) === 0)
      .length;
  }, [consultas]);

  const handleEliminar = async (idConsulta) => {
    const confirmar = window.confirm("¿Deseas eliminar esta consulta?");

    if (!confirmar) return;

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await deleteConsultaRequest(idConsulta);

      setMensajeOk("Consulta eliminada correctamente");
      await cargarConsultas();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al eliminar consulta"
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroMedicacion("TODAS");
  };

  return (
    <section className="page consultas-page">
      <div className="page-header">
        <div>
          <h1>Consultas médicas</h1>
          <p>Listado general de consultas registradas en el sistema.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn-light" onClick={cargarConsultas}>
            Actualizar
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/pacientes/listado")}
          >
            Nueva consulta
          </button>
        </div>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="consultas-summary-grid">
        <div className="summary-card">
          <span>Total consultas</span>
          <strong>{totalConsultas}</strong>
        </div>

        <div className="summary-card">
          <span>Con medicación</span>
          <strong>{totalConMedicacion}</strong>
        </div>

        <div className="summary-card">
          <span>Sin medicación</span>
          <strong>{totalSinMedicacion}</strong>
        </div>

        <div className="summary-card">
          <span>Resultado actual</span>
          <strong>{consultasFiltradas.length}</strong>
        </div>
      </div>

      <div className="card consultas-filter-card">
        <div className="consultas-filter-header">
          <div>
            <h2>Buscar consultas</h2>
            <p>Filtra por paciente, DNI, motivo o diagnóstico.</p>
          </div>
        </div>

        <div className="consultas-toolbar">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por paciente, DNI o motivo..."
          />

          <select
            value={filtroMedicacion}
            onChange={(e) => setFiltroMedicacion(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="CON_MEDICACION">Con medicación</option>
            <option value="SIN_MEDICACION">Sin medicación</option>
          </select>

          <button type="button" className="btn-light" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="card consultas-list-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Registro de consultas</h2>
            <p>Consultas ordenadas desde la más reciente.</p>
          </div>
        </div>

        {loading && <p>Cargando...</p>}

        <div className="consultas-cards-list">
          {consultasFiltradas.length === 0 ? (
            <div className="empty-box">
              No hay consultas que coincidan con los filtros.
            </div>
          ) : (
            consultasFiltradas.map((consulta) => (
              <div className="consulta-row-card" key={consulta.id}>
                <div className="consulta-row-main">
                  <div>
                    <div className="consulta-row-title">
                      <h3>{consulta.paciente || "Paciente"}</h3>

                      <span
                        className={
                          Number(consulta.medicacion) === 1
                            ? "badge badge-ok"
                            : "badge badge-muted"
                        }
                      >
                        {Number(consulta.medicacion) === 1
                          ? "Con medicación"
                          : "Sin medicación"}
                      </span>
                    </div>

                    <p className="consulta-row-subtitle">
                      DNI: {consulta.DNI || "-"} | Consulta #{consulta.id}
                    </p>

                    <div className="consulta-motivo-box">
                      <span>Motivo de consulta</span>
                      <p>{consulta.motivo_consulta || "Sin motivo registrado"}</p>
                    </div>
                  </div>

                  <div className="consulta-row-date">
                    <span>Fecha</span>
                    <strong>
                      {consulta.created_at
                        ? new Date(consulta.created_at).toLocaleString()
                        : "-"}
                    </strong>
                  </div>
                </div>

                <div className="consulta-row-footer">
                  <div>
                    <span>Diagnóstico</span>
                    <strong>
                      {consulta.diagnostico_descripcion ||
                        consulta.diagnostico_codigo ||
                        "Pendiente CIE10"}
                    </strong>
                  </div>

                  <div className="table-actions">
                    <button
                      className="btn-small"
                      onClick={() =>
                        navigate(`/pacientes/${consulta.id_paciente}/consultas`)
                      }
                    >
                      Ver historial
                    </button>

                    <button
                      className="btn-small"
                      onClick={() => navigate(`/consultas/${consulta.id}/editar`)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-small"
                      onClick={() =>
                        navigate(`/consultas/${consulta.id}/recetas`)
                      }
                    >
                      Recetas
                    </button>

                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleEliminar(consulta.id)}
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