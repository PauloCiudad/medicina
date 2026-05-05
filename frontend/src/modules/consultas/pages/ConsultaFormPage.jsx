import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPacienteByIdRequest } from "../../pacientes/services/pacientesService";
import { searchCie10Request } from "../../cie10/services/cie10Service";

import {
  createConsultaRequest,
  getConsultaByIdRequest,
  updateConsultaRequest,
} from "../services/consultasService";

const initialForm = {
  motivo_consulta: "",
  diagnostico: "",
  medicacion: "0",
  peso: "",
  talla: "",
  temperatura: "",
  presion_arterial: "",
  frecuencia_cardiaca: "",
  frecuencia_respiratoria: "",
  saturacion_oxigeno: "",
};

export default function ConsultaFormPage() {
  const navigate = useNavigate();
  const { idPaciente, idConsulta } = useParams();

  const esEdicion = Boolean(idConsulta);

  const [paciente, setPaciente] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [mostrarSignos, setMostrarSignos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [buscandoCie10, setBuscandoCie10] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const [cie10Query, setCie10Query] = useState("");
  const [cie10Resultados, setCie10Resultados] = useState([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);

  const cargarData = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      if (esEdicion) {
        const consulta = await getConsultaByIdRequest(idConsulta);

        setPaciente({
          id: consulta.id_paciente,
          DNI: consulta.DNI,
          nombre_completo: consulta.paciente,
        });

        setForm({
          motivo_consulta: consulta.motivo_consulta || "",
          medicacion: String(consulta.medicacion ?? "0"),
          peso: consulta.signos_vitales?.peso || "",
          talla: consulta.signos_vitales?.talla || "",
          temperatura: consulta.signos_vitales?.temperatura || "",
          presion_arterial: consulta.signos_vitales?.presion_arterial || "",
          frecuencia_cardiaca:
            consulta.signos_vitales?.frecuencia_cardiaca || "",
          frecuencia_respiratoria:
            consulta.signos_vitales?.frecuencia_respiratoria || "",
          saturacion_oxigeno:
            consulta.signos_vitales?.saturacion_oxigeno || "",
          diagnostico: consulta.diagnostico || "",
        });

        if (consulta.diagnostico) {
          const diagnosticoActual = {
            id: consulta.diagnostico,
            codigo: consulta.diagnostico_codigo,
            descripcion: consulta.diagnostico_descripcion,
          };

          setDiagnosticoSeleccionado(diagnosticoActual);
          setCie10Query(
            `${diagnosticoActual.codigo || ""} - ${
              diagnosticoActual.descripcion || ""
            }`
          );
        }
      } else {
        const pacienteData = await getPacienteByIdRequest(idPaciente);
        setPaciente(pacienteData);
      }
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar información"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, [idPaciente, idConsulta]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const setMedicacion = (value) => {
    setForm({
      ...form,
      medicacion: value,
    });
  };

  const buscarCie10 = async () => {
    try {
      setMensajeError("");

      if (!cie10Query.trim()) {
        setCie10Resultados([]);
        return;
      }

      setBuscandoCie10(true);

      const resultados = await searchCie10Request(cie10Query.trim(), 20);

      setCie10Resultados(resultados || []);
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al buscar diagnóstico CIE10"
      );
    } finally {
      setBuscandoCie10(false);
    }
  };

  const handleCie10KeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarCie10();
    }
  };

  const seleccionarDiagnostico = (item) => {
    setForm({
      ...form,
      diagnostico: item.id,
    });

    setDiagnosticoSeleccionado(item);
    setCie10Query(`${item.codigo} - ${item.descripcion}`);
    setCie10Resultados([]);
  };

  const limpiarDiagnostico = () => {
    setForm({
      ...form,
      diagnostico: "",
    });

    setDiagnosticoSeleccionado(null);
    setCie10Query("");
    setCie10Resultados([]);
  };

  const validarFormulario = () => {
    if (!form.motivo_consulta.trim()) {
      return "El motivo de consulta es obligatorio";
    }

    if (form.peso && Number(form.peso) <= 0) {
      return "El peso debe ser mayor a 0";
    }

    if (form.talla && Number(form.talla) <= 0) {
      return "La talla debe ser mayor a 0";
    }

    if (form.temperatura && Number(form.temperatura) <= 0) {
      return "La temperatura debe ser mayor a 0";
    }

    return null;
  };

  const prepararPayload = () => {
    const idPacienteFinal = esEdicion ? paciente?.id : idPaciente;

    return {
      id_paciente: Number(idPacienteFinal),
      motivo_consulta: form.motivo_consulta.trim(),
      diagnostico: form.diagnostico ? Number(form.diagnostico) : null,
      medicacion: Number(form.medicacion),
      signos_vitales: {
        peso: form.peso ? Number(form.peso) : null,
        talla: form.talla ? Number(form.talla) : null,
        temperatura: form.temperatura ? Number(form.temperatura) : null,
        presion_arterial: form.presion_arterial || null,
        frecuencia_cardiaca: form.frecuencia_cardiaca
          ? Number(form.frecuencia_cardiaca)
          : null,
        frecuencia_respiratoria: form.frecuencia_respiratoria
          ? Number(form.frecuencia_respiratoria)
          : null,
        saturacion_oxigeno: form.saturacion_oxigeno
          ? Number(form.saturacion_oxigeno)
          : null,
      },
    };
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

      const payload = prepararPayload();

      if (esEdicion) {
        await updateConsultaRequest(idConsulta, payload);
        setMensajeOk("Consulta actualizada correctamente");
      } else {
        await createConsultaRequest(payload);
        setMensajeOk("Consulta registrada correctamente");
        setForm(initialForm);
        limpiarDiagnostico();
      }
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al guardar consulta"
      );
    } finally {
      setLoading(false);
    }
  };

  const nombrePaciente = paciente?.nombre_completo
    ? paciente.nombre_completo
    : [
        paciente?.nombre,
        paciente?.nombre_2,
        paciente?.apellido_pat,
        paciente?.apellido_mat,
      ]
        .filter(Boolean)
        .join(" ");

  const idPacienteFinal = esEdicion ? paciente?.id : idPaciente;

  return (
    <section className="page consulta-page">
      <div className="page-header">
        <div>
          <h1>{esEdicion ? "Editar consulta" : "Nueva consulta"}</h1>
          <p>
            {paciente
              ? `${nombrePaciente} - DNI: ${paciente.DNI || "-"}`
              : "Cargando paciente..."}
          </p>
        </div>

        <button
          type="button"
          className="btn-light"
          onClick={() => navigate(`/pacientes/${idPacienteFinal}/consultas`)}
        >
          Volver
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="local-actions">
        <button
          type="button"
          className="btn-light"
          onClick={() => navigate(`/pacientes/${idPacienteFinal}/consultas`)}
        >
          Volver a consultas
        </button>
      </div>

      <form className="consulta-card" onSubmit={handleSubmit}>
        <div className="consulta-main-box">
          <div className="consulta-section-header">
            <div>
              <h2>Motivo de consulta</h2>
              <p>Describe brevemente por qué acude el paciente.</p>
            </div>
          </div>

          <textarea
            className="motivo-textarea"
            name="motivo_consulta"
            value={form.motivo_consulta}
            onChange={handleChange}
            placeholder="Ej. Dolor de garganta, fiebre y malestar general desde hace 2 días..."
          />

          <div className="medicacion-box">
            <span>¿Se dará medicación?</span>

            <div className="segmented-control">
              <button
                type="button"
                className={form.medicacion === "0" ? "active" : ""}
                onClick={() => setMedicacion("0")}
              >
                No
              </button>

              <button
                type="button"
                className={form.medicacion === "1" ? "active" : ""}
                onClick={() => setMedicacion("1")}
              >
                Sí
              </button>
            </div>
          </div>
        </div>

        <div className="cie10-box">
          <div className="consulta-section-header">
            <div>
              <h2>Diagnóstico CIE10</h2>
              <p>Busca por código o descripción del diagnóstico.</p>
            </div>
          </div>

          <div className="cie10-search-row">
            <input
              value={cie10Query}
              onChange={(e) => setCie10Query(e.target.value)}
              onKeyDown={handleCie10KeyDown}
              placeholder="Ej. gripe, fiebre, diabetes, J00..."
            />

            <button
              type="button"
              className="btn-secondary"
              onClick={buscarCie10}
              disabled={buscandoCie10}
            >
              {buscandoCie10 ? "Buscando..." : "Buscar"}
            </button>

            {diagnosticoSeleccionado && (
              <button
                type="button"
                className="btn-light"
                onClick={limpiarDiagnostico}
              >
                Limpiar
              </button>
            )}
          </div>

          {diagnosticoSeleccionado && (
            <div className="cie10-selected">
              <span>Diagnóstico seleccionado</span>
              <strong>
                {diagnosticoSeleccionado.codigo} -{" "}
                {diagnosticoSeleccionado.descripcion}
              </strong>
            </div>
          )}

          {cie10Resultados.length > 0 && (
            <div className="cie10-results">
              {cie10Resultados.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="cie10-result-item"
                  onClick={() => seleccionarDiagnostico(item)}
                >
                  <strong>{item.codigo}</strong>
                  <span>{item.descripcion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="consulta-main-box">
          <div className="consulta-section-header">
            <div>
              <h2>Signos vitales</h2>
              <p>Registra solo los datos disponibles.</p>
            </div>

            <button
              type="button"
              className="btn-light"
              onClick={() => setMostrarSignos(!mostrarSignos)}
            >
              {mostrarSignos ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {mostrarSignos && (
            <div className="vitales-grid">
              <div className="vital-card">
                <label>Peso</label>
                <input
                  type="number"
                  step="0.01"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  placeholder="72.5"
                />
                <small>kg</small>
              </div>

              <div className="vital-card">
                <label>Talla</label>
                <input
                  type="number"
                  step="0.01"
                  name="talla"
                  value={form.talla}
                  onChange={handleChange}
                  placeholder="1.68"
                />
                <small>m</small>
              </div>

              <div className="vital-card">
                <label>Temperatura</label>
                <input
                  type="number"
                  step="0.01"
                  name="temperatura"
                  value={form.temperatura}
                  onChange={handleChange}
                  placeholder="37.2"
                />
                <small>°C</small>
              </div>

              <div className="vital-card">
                <label>Presión arterial</label>
                <input
                  name="presion_arterial"
                  value={form.presion_arterial}
                  onChange={handleChange}
                  placeholder="120/80"
                />
                <small>mmHg</small>
              </div>

              <div className="vital-card">
                <label>Frec. cardiaca</label>
                <input
                  type="number"
                  name="frecuencia_cardiaca"
                  value={form.frecuencia_cardiaca}
                  onChange={handleChange}
                  placeholder="78"
                />
                <small>lpm</small>
              </div>

              <div className="vital-card">
                <label>Frec. respiratoria</label>
                <input
                  type="number"
                  name="frecuencia_respiratoria"
                  value={form.frecuencia_respiratoria}
                  onChange={handleChange}
                  placeholder="18"
                />
                <small>rpm</small>
              </div>

              <div className="vital-card">
                <label>Saturación O₂</label>
                <input
                  type="number"
                  name="saturacion_oxigeno"
                  value={form.saturacion_oxigeno}
                  onChange={handleChange}
                  placeholder="98"
                />
                <small>%</small>
              </div>
            </div>
          )}
        </div>

        <div className="sticky-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : esEdicion
              ? "Actualizar consulta"
              : "Guardar consulta"}
          </button>

          <button
            type="button"
            className="btn-light"
            onClick={() => navigate(`/pacientes/${idPacienteFinal}/consultas`)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}