import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPacientesRequest,
  deletePacienteRequest,
} from "../services/pacientesService";

export default function PacientesListadoPage() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const data = await getPacientesRequest();
      setPacientes(data || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar pacientes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este paciente?");

    if (!confirmar) return;

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await deletePacienteRequest(id);

      setMensajeOk("Paciente eliminado correctamente");
      await cargarPacientes();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al eliminar paciente"
      );
    } finally {
      setLoading(false);
    }
  };

  const getNombreCompleto = (paciente) => {
    return [
      paciente.nombre,
      paciente.nombre_2,
      paciente.apellido_pat,
      paciente.apellido_mat,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getSexoTexto = (sexo) => {
    if (Number(sexo) === 1) return "Masculino";
    if (Number(sexo) === 2) return "Femenino";
    return "-";
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Registro de pacientes</h1>
          <p>Listado general de pacientes registrados.</p>
        </div>

        <div className="page-header-actions">
          <button className="btn-light" onClick={cargarPacientes}>
            Actualizar
          </button>

          <button className="btn-secondary" onClick={() => navigate("/pacientes")}>
            Nuevo paciente
          </button>
        </div>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="local-actions">
        <button className="btn-light" onClick={cargarPacientes}>
          Actualizar
        </button>

        <button className="btn-secondary" onClick={() => navigate("/pacientes")}>
          Nuevo paciente
        </button>
      </div>

      <div className="card table-card">
        <h2>Pacientes registrados</h2>

        {loading && <p>Cargando...</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Alergias</th>
                <th>Fecha registro</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="8">No hay pacientes registrados.</td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.DNI || "-"}</td>
                    <td>{getNombreCompleto(paciente)}</td>
                    <td>{paciente.edad || "-"}</td>
                    <td>{getSexoTexto(paciente.sexo)}</td>
                    <td>{paciente.alergias || "-"}</td>
                    <td>
                      {paciente.created_at
                        ? new Date(paciente.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-small"
                          onClick={() =>
                            navigate(`/pacientes/${paciente.id}/editar`)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="btn-small"
                          onClick={() => navigate(`/pacientes/${paciente.id}/consultas`)}
                        >
                          Consultas
                        </button>

                        <button
                          className="btn-small btn-danger"
                          onClick={() => handleEliminar(paciente.id)}
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