import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardDataRequest } from "../services/dashboardService";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    pacientes: [],
    consultas: [],
    medicamentos: [],
    stockBajo: [],
    movimientos: [],
  });

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const dashboardData = await getDashboardDataRequest();

      setData(dashboardData);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const totalStock = useMemo(() => {
    return data.medicamentos.reduce((total, medicamento) => {
      return total + Number(medicamento.stock || 0);
    }, 0);
  }, [data.medicamentos]);

  const consultasConMedicacion = useMemo(() => {
    return data.consultas.filter((consulta) => Number(consulta.medicacion) === 1)
      .length;
  }, [data.consultas]);

  const ultimasConsultas = useMemo(() => {
    return data.consultas.slice(0, 5);
  }, [data.consultas]);

  const ultimosMovimientos = useMemo(() => {
    return data.movimientos.slice(0, 5);
  }, [data.movimientos]);

  const getTipoMovimientoClass = (tipo) => {
    if (tipo === "ENTRADA") return "dashboard-badge badge-green";
    if (tipo === "SALIDA") return "dashboard-badge badge-red";
    if (tipo === "AJUSTE") return "dashboard-badge badge-yellow";

    return "dashboard-badge badge-gray";
  };

  return (
    <section className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema médico SERUMS.</p>
        </div>

        <button className="btn-secondary" onClick={cargarDashboard}>
          Actualizar
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {loading && <div className="alert alert-ok">Cargando información...</div>}

      <div className="dashboard-cards-grid">
        <button
          className="dashboard-card"
          onClick={() => navigate("/pacientes/listado")}
        >
          <span>Pacientes registrados</span>
          <strong>{data.pacientes.length}</strong>
          <small>Ver registro</small>
        </button>

        <button
          className="dashboard-card"
          onClick={() => navigate("/consultas")}
        >
          <span>Consultas registradas</span>
          <strong>{data.consultas.length}</strong>
          <small>{consultasConMedicacion} con medicación</small>
        </button>

        <button
          className="dashboard-card"
          onClick={() => navigate("/medicamentos")}
        >
          <span>Medicamentos</span>
          <strong>{data.medicamentos.length}</strong>
          <small>Stock total: {totalStock}</small>
        </button>

        <button
          className="dashboard-card dashboard-card-warning"
          onClick={() => navigate("/medicamentos")}
        >
          <span>Stock bajo</span>
          <strong>{data.stockBajo.length}</strong>
          <small>Medicamentos por revisar</small>
        </button>
      </div>

      <div className="dashboard-actions-grid">
        <button onClick={() => navigate("/pacientes")}>
          Registrar paciente
        </button>

        <button onClick={() => navigate("/pacientes/listado")}>
          Ver pacientes
        </button>

        <button onClick={() => navigate("/medicamentos")}>
          Gestionar medicamentos
        </button>

        <button onClick={() => navigate("/inventario")}>
          Ver inventario
        </button>
      </div>

      <div className="dashboard-content-grid">
        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>Últimas consultas</h2>
              <p>Consultas médicas registradas recientemente.</p>
            </div>
          </div>

          {ultimasConsultas.length === 0 ? (
            <p>No hay consultas registradas.</p>
          ) : (
            <div className="dashboard-list">
              {ultimasConsultas.map((consulta) => (
                <div className="dashboard-list-item" key={consulta.id}>
                  <div>
                    <strong>{consulta.paciente || "Paciente"}</strong>
                    <span>{consulta.motivo_consulta || "Sin motivo registrado"}</span>
                  </div>

                  <small>
                    {consulta.created_at
                      ? new Date(consulta.created_at).toLocaleString()
                      : "-"}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>Últimos movimientos</h2>
              <p>Entradas, salidas y ajustes de inventario.</p>
            </div>
          </div>

          {ultimosMovimientos.length === 0 ? (
            <p>No hay movimientos registrados.</p>
          ) : (
            <div className="dashboard-list">
              {ultimosMovimientos.map((movimiento) => (
                <div className="dashboard-list-item" key={movimiento.id}>
                  <div>
                    <strong>{movimiento.medicamento}</strong>
                    <span>{movimiento.motivo || "Sin motivo"}</span>
                  </div>

                  <div className="dashboard-movement-info">
                    <span className={getTipoMovimientoClass(movimiento.tipo_movimiento)}>
                      {movimiento.tipo_movimiento}
                    </span>
                    <small>Cantidad: {movimiento.cantidad}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card dashboard-stock-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Medicamentos con stock bajo</h2>
            <p>Medicamentos con stock menor o igual a 10.</p>
          </div>

          <button className="btn-light" onClick={() => navigate("/medicamentos")}>
            Ver medicamentos
          </button>
        </div>

        {data.stockBajo.length === 0 ? (
          <p>No hay medicamentos con stock bajo.</p>
        ) : (
          <div className="dashboard-stock-grid">
            {data.stockBajo.map((medicamento) => (
              <div className="dashboard-stock-item" key={medicamento.id}>
                <div>
                  <strong>{medicamento.nombre}</strong>
                  <span>{medicamento.cantidad}</span>
                </div>

                <b>Stock: {medicamento.stock}</b>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}