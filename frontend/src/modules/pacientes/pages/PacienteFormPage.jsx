import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createPacienteRequest,
  getPacienteByIdRequest,
  updatePacienteRequest,
} from "../services/pacientesService";

import {
  getCatalogoAntecedentesRequest,
  getAntecedentesPacienteRequest,
  saveAntecedentesPacienteRequest,
} from "../../antecedentes/services/antecedentesService";

const initialForm = {
  DNI: "",
  nombre: "",
  nombre_2: "",
  apellido_pat: "",
  apellido_mat: "",
  edad: "",
  antecedentes_fam: null,
  otros_antecedentes_fam: "",
  antecedentes_pat: null,
  otros_antecedentes_pat: "",
  sexo: "",
  alergias: "",
};

export default function PacienteFormPage() {
  const navigate = useNavigate();
  const { idPaciente } = useParams();

  const esEdicion = Boolean(idPaciente);

  const [form, setForm] = useState(initialForm);

  const [catalogoAntecedentes, setCatalogoAntecedentes] = useState([]);
  const [antecedentesFamiliares, setAntecedentesFamiliares] = useState([]);
  const [antecedentesPatologicos, setAntecedentesPatologicos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const idOtros = catalogoAntecedentes.find((item) =>
    item.nombre?.toLowerCase().includes("otros")
  )?.id;

  const mostrarOtrosFam =
    idOtros && antecedentesFamiliares.includes(Number(idOtros));

  const mostrarOtrosPat =
    idOtros && antecedentesPatologicos.includes(Number(idOtros));

  const cargarCatalogo = async () => {
    const data = await getCatalogoAntecedentesRequest();
    setCatalogoAntecedentes(data || []);
  };

  const cargarPacienteEdicion = async () => {
    if (!esEdicion) return;

    const paciente = await getPacienteByIdRequest(idPaciente);

    setForm({
      DNI: paciente.DNI || "",
      nombre: paciente.nombre || "",
      nombre_2: paciente.nombre_2 || "",
      apellido_pat: paciente.apellido_pat || "",
      apellido_mat: paciente.apellido_mat || "",
      edad: paciente.edad || "",
      antecedentes_fam: paciente.antecedentes_fam || null,
      otros_antecedentes_fam: paciente.otros_antecedentes_fam || "",
      antecedentes_pat: paciente.antecedentes_pat || null,
      otros_antecedentes_pat: paciente.otros_antecedentes_pat || "",
      sexo: paciente.sexo || "",
      alergias: paciente.alergias || "",
    });

    const antecedentes = await getAntecedentesPacienteRequest(idPaciente);

    setAntecedentesFamiliares(
      antecedentes.familiares?.map((item) => Number(item.id_antecedente)) || []
    );

    setAntecedentesPatologicos(
      antecedentes.patologicos?.map((item) => Number(item.id_antecedente)) || []
    );

    setForm((prev) => ({
      ...prev,
      otros_antecedentes_fam:
        antecedentes.paciente?.otros_antecedentes_fam || "",
      otros_antecedentes_pat:
        antecedentes.paciente?.otros_antecedentes_pat || "",
    }));
  };

  const cargarDataInicial = async () => {
    try {
      setLoading(true);
      setMensajeError("");

      await cargarCatalogo();
      await cargarPacienteEdicion();
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al cargar información"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDataInicial();
  }, [idPaciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleAntecedenteFamiliar = (id) => {
    const idNumerico = Number(id);

    if (antecedentesFamiliares.includes(idNumerico)) {
      setAntecedentesFamiliares(
        antecedentesFamiliares.filter((item) => item !== idNumerico)
      );

      if (Number(idOtros) === idNumerico) {
        setForm({
          ...form,
          otros_antecedentes_fam: "",
        });
      }
    } else {
      setAntecedentesFamiliares([...antecedentesFamiliares, idNumerico]);
    }
  };

  const toggleAntecedentePatologico = (id) => {
    const idNumerico = Number(id);

    if (antecedentesPatologicos.includes(idNumerico)) {
      setAntecedentesPatologicos(
        antecedentesPatologicos.filter((item) => item !== idNumerico)
      );

      if (Number(idOtros) === idNumerico) {
        setForm({
          ...form,
          otros_antecedentes_pat: "",
        });
      }
    } else {
      setAntecedentesPatologicos([...antecedentesPatologicos, idNumerico]);
    }
  };

  const limpiarFormulario = () => {
    setForm(initialForm);
    setAntecedentesFamiliares([]);
    setAntecedentesPatologicos([]);
    setMensajeError("");
    setMensajeOk("");
  };

  const prepararPacientePayload = () => {
    return {
      DNI: form.DNI || null,
      nombre: form.nombre.trim(),
      nombre_2: form.nombre_2 || null,
      apellido_pat: form.apellido_pat.trim(),
      apellido_mat: form.apellido_mat || null,
      edad: form.edad ? Number(form.edad) : null,
      antecedentes_fam: null,
      otros_antecedentes_fam: form.otros_antecedentes_fam || null,
      antecedentes_pat: null,
      otros_antecedentes_pat: form.otros_antecedentes_pat || null,
      sexo: form.sexo ? Number(form.sexo) : null,
      alergias: form.alergias || null,
    };
  };

  const prepararAntecedentesPayload = () => {
    return {
      antecedentes_familiares: antecedentesFamiliares,
      antecedentes_patologicos: antecedentesPatologicos,
      otros_antecedentes_fam: form.otros_antecedentes_fam || null,
      otros_antecedentes_pat: form.otros_antecedentes_pat || null,
    };
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      return "El primer nombre es obligatorio";
    }

    if (!form.apellido_pat.trim()) {
      return "El apellido paterno es obligatorio";
    }

    if (form.edad && Number(form.edad) < 0) {
      return "La edad no puede ser negativa";
    }

    if (mostrarOtrosFam && !form.otros_antecedentes_fam.trim()) {
      return "Debe escribir el detalle de otros antecedentes familiares";
    }

    if (mostrarOtrosPat && !form.otros_antecedentes_pat.trim()) {
      return "Debe escribir el detalle de otros antecedentes patológicos";
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

      const pacientePayload = prepararPacientePayload();

      let pacienteGuardado;

      if (esEdicion) {
        pacienteGuardado = await updatePacienteRequest(
          idPaciente,
          pacientePayload
        );
      } else {
        pacienteGuardado = await createPacienteRequest(pacientePayload);
      }

      const idPacienteFinal = esEdicion ? idPaciente : pacienteGuardado.id;

      await saveAntecedentesPacienteRequest(
        idPacienteFinal,
        prepararAntecedentesPayload()
      );

      setMensajeOk(
        esEdicion
          ? "Paciente actualizado correctamente"
          : "Paciente registrado correctamente"
      );

      if (!esEdicion) {
        limpiarFormulario();
      }
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al guardar paciente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{esEdicion ? "Editar paciente" : "Registrar paciente"}</h1>
          <p>
            Ingrese los datos personales, antecedentes familiares y antecedentes
            patológicos.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/pacientes/listado")}
        >
          Ver registro de pacientes
        </button>
      </div>

      {mensajeError && <div className="alert alert-error">{mensajeError}</div>}
      {mensajeOk && <div className="alert alert-ok">{mensajeOk}</div>}

      <div className="local-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/pacientes/listado")}
        >
          Ver registro de pacientes
        </button>
      </div>


      <form className="card paciente-form-card" onSubmit={handleSubmit}>
        <h2>Datos del paciente</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>DNI</label>
            <input
              name="DNI"
              value={form.DNI}
              onChange={handleChange}
              placeholder="Ej. 12345678"
            />
          </div>

          <div className="form-group">
            <label>Primer nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan"
            />
          </div>

          <div className="form-group">
            <label>Segundo nombre</label>
            <input
              name="nombre_2"
              value={form.nombre_2}
              onChange={handleChange}
              placeholder="Ej. Carlos"
            />
          </div>

          <div className="form-group">
            <label>Apellido paterno *</label>
            <input
              name="apellido_pat"
              value={form.apellido_pat}
              onChange={handleChange}
              placeholder="Ej. Pérez"
            />
          </div>

          <div className="form-group">
            <label>Apellido materno</label>
            <input
              name="apellido_mat"
              value={form.apellido_mat}
              onChange={handleChange}
              placeholder="Ej. Ramos"
            />
          </div>

          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              placeholder="Ej. 35"
            />
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <select name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </select>
          </div>

          <div className="form-group full">
            <label>Alergias</label>
            <textarea
              name="alergias"
              value={form.alergias}
              onChange={handleChange}
              placeholder="Ej. Ninguna / alergia a penicilina"
            />
          </div>
        </div>

        <div className="antecedentes-form-section">
          <div className="antecedentes-box">
            <h2>Antecedentes familiares</h2>

            <div className="checkbox-list">
              {catalogoAntecedentes.map((item) => (
                <label key={`fam-${item.id}`} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={antecedentesFamiliares.includes(Number(item.id))}
                    onChange={() => toggleAntecedenteFamiliar(item.id)}
                  />
                  <span>{item.nombre}</span>
                </label>
              ))}
            </div>

            {mostrarOtrosFam && (
              <div className="form-group full mt-16">
                <label>Detalle de otros antecedentes familiares *</label>
                <textarea
                  name="otros_antecedentes_fam"
                  value={form.otros_antecedentes_fam}
                  onChange={handleChange}
                  placeholder="Ej. Cáncer gástrico en abuelo materno"
                />
              </div>
            )}
          </div>

          <div className="antecedentes-box">
            <h2>Antecedentes patológicos</h2>

            <div className="checkbox-list">
              {catalogoAntecedentes.map((item) => (
                <label key={`pat-${item.id}`} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={antecedentesPatologicos.includes(
                      Number(item.id)
                    )}
                    onChange={() => toggleAntecedentePatologico(item.id)}
                  />
                  <span>{item.nombre}</span>
                </label>
              ))}
            </div>

            {mostrarOtrosPat && (
              <div className="form-group full mt-16">
                <label>Detalle de otros antecedentes patológicos *</label>
                <textarea
                  name="otros_antecedentes_pat"
                  value={form.otros_antecedentes_pat}
                  onChange={handleChange}
                  placeholder="Ej. Asma en la infancia"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : esEdicion
              ? "Actualizar paciente"
              : "Registrar paciente"}
          </button>

          <button
            type="button"
            className="btn-light"
            onClick={() => navigate("/pacientes/listado")}
          >
            Ir al listado
          </button>

          {!esEdicion && (
            <button type="button" className="btn-light" onClick={limpiarFormulario}>
              Limpiar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}