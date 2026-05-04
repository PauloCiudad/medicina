import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getConsultasByPacienteRequest,
  deleteConsultaRequest,
} from "../services/consultasService";

export default function ConsultasPacientePage() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const data = await getConsultasByPacienteRequest(idPaciente);

      setPaciente(data.paciente || null);
      setConsultas(data.consultas || []);
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
  }, [idPaciente]);

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

  const nombreCompleto = paciente
    ? [
        paciente.nombre,
        paciente.nombre_2,
        paciente.apellido_pat,
        paciente.apellido_mat,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Consultas del paciente</h1>
          <p>
            {paciente
              ? `${nombreCompleto} - DNI: ${paciente.DNI || "-"}`
              : "Cargando paciente..."}
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-light" onClick={() => navigate("/pacientes/listado")}>
            Volver
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate(`/pacientes/${idPaciente}/consultas/nueva`)}
          >
            Nueva consulta
          </button>
        </div>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}
    
      <div className="local-actions">
        <button className="btn-light" onClick={() => navigate("/pacientes/listado")}>
            Volver a pacientes
        </button>

        <button
            className="btn-secondary"
            onClick={() => navigate(`/pacientes/${idPaciente}/consultas/nueva`)}
        >
            Nueva consulta
        </button>
      </div>

      <div className="card table-card">
        <h2>Historial de consultas</h2>

        {loading && <p>Cargando...</p>}

        <div className="table-wrapper">
          <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Motivo</th>
                    <th>Diagnóstico</th>
                    <th>Medicación</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {consultas.length === 0 ? (
                    <tr>
                    <td colSpan="6">No hay consultas registradas para este paciente.</td>
                    </tr>
                ) : (
                    consultas.map((consulta) => (
                    <tr key={consulta.id}>
                        <td>{consulta.id}</td>
                        <td>
                        {consulta.created_at
                            ? new Date(consulta.created_at).toLocaleString()
                            : "-"}
                        </td>
                        <td>{consulta.motivo_consulta || "-"}</td>
                        <td>
                        {consulta.diagnostico_descripcion ||
                            consulta.diagnostico_codigo ||
                            "Pendiente CIE10"}
                        </td>
                        <td>
                        <span
                            className={
                            Number(consulta.medicacion) === 1
                                ? "badge badge-ok"
                                : "badge badge-muted"
                            }
                        >
                            {Number(consulta.medicacion) === 1 ? "Sí" : "No"}
                        </span>
                        </td>
                        <td>
                        <div className="table-actions">
                            <button
                            className="btn-small"
                            onClick={() => navigate(`/consultas/${consulta.id}/editar`)}
                            >
                            Editar
                            </button>

                            <button
                            className="btn-small"
                            onClick={() => navigate(`/consultas/${consulta.id}/recetas`)}
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
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}