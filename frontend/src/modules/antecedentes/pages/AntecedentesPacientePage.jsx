import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCatalogoAntecedentesRequest,
  getAntecedentesPacienteRequest,
  saveAntecedentesPacienteRequest,
} from "../services/antecedentesService";

export default function AntecedentesPacientePage() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [catalogo, setCatalogo] = useState([]);
  const [paciente, setPaciente] = useState(null);

  const [familiares, setFamiliares] = useState([]);
  const [patologicos, setPatologicos] = useState([]);

  const [otrosFam, setOtrosFam] = useState("");
  const [otrosPat, setOtrosPat] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const cargarData = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      const catalogoData = await getCatalogoAntecedentesRequest();
      const antecedentesData = await getAntecedentesPacienteRequest(idPaciente);

      setCatalogo(catalogoData || []);
      setPaciente(antecedentesData.paciente || null);

      setFamiliares(
        antecedentesData.familiares?.map((item) =>
          Number(item.id_antecedente)
        ) || []
      );

      setPatologicos(
        antecedentesData.patologicos?.map((item) =>
          Number(item.id_antecedente)
        ) || []
      );

      setOtrosFam(antecedentesData.paciente?.otros_antecedentes_fam || "");
      setOtrosPat(antecedentesData.paciente?.otros_antecedentes_pat || "");
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar antecedentes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, [idPaciente]);

  const toggleFamiliar = (idAntecedente) => {
    const id = Number(idAntecedente);

    if (familiares.includes(id)) {
      setFamiliares(familiares.filter((item) => item !== id));
    } else {
      setFamiliares([...familiares, id]);
    }
  };

  const togglePatologico = (idAntecedente) => {
    const id = Number(idAntecedente);

    if (patologicos.includes(id)) {
      setPatologicos(patologicos.filter((item) => item !== id));
    } else {
      setPatologicos([...patologicos, id]);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMensajeError("");
      setMensajeOk("");

      await saveAntecedentesPacienteRequest(idPaciente, {
        antecedentes_familiares: familiares,
        antecedentes_patologicos: patologicos,
        otros_antecedentes_fam: otrosFam || null,
        otros_antecedentes_pat: otrosPat || null,
      });

      setMensajeOk("Antecedentes guardados correctamente");
      await cargarData();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al guardar antecedentes"
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
          <h1>Antecedentes del paciente</h1>
          <p>
            {paciente
              ? `${nombreCompleto} - DNI: ${paciente.DNI || "-"}`
              : "Cargando paciente..."}
          </p>
        </div>

        <button className="btn-light" onClick={() => navigate("/pacientes")}>
          Volver
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <form className="card" onSubmit={handleGuardar}>
        <div className="antecedentes-grid">
          <div>
            <h2>Antecedentes familiares</h2>

            <div className="checkbox-list">
              {catalogo.map((item) => (
                <label key={`fam-${item.id}`} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={familiares.includes(Number(item.id))}
                    onChange={() => toggleFamiliar(item.id)}
                  />
                  <span>{item.nombre}</span>
                </label>
              ))}
            </div>

            <div className="form-group full mt-16">
              <label>Otros antecedentes familiares</label>
              <textarea
                value={otrosFam}
                onChange={(e) => setOtrosFam(e.target.value)}
                placeholder="Ej. Cáncer gástrico en abuelo materno"
              />
            </div>
          </div>

          <div>
            <h2>Antecedentes patológicos</h2>

            <div className="checkbox-list">
              {catalogo.map((item) => (
                <label key={`pat-${item.id}`} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={patologicos.includes(Number(item.id))}
                    onChange={() => togglePatologico(item.id)}
                  />
                  <span>{item.nombre}</span>
                </label>
              ))}
            </div>

            <div className="form-group full mt-16">
              <label>Otros antecedentes patológicos</label>
              <textarea
                value={otrosPat}
                onChange={(e) => setOtrosPat(e.target.value)}
                placeholder="Ej. Asma en la infancia"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar antecedentes"}
          </button>

          <button
            type="button"
            className="btn-light"
            onClick={() => navigate("/pacientes")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}