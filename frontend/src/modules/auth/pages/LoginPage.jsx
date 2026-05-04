import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../authService";
import { useAuthStore } from "../../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setLoading(true);

    try {
      const data = await loginRequest(form);

      login({
        token: data.token,
        usuario: data.usuario,
      });

      navigate("/dashboard");
    } catch (error) {
      setMensajeError(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>SERUMS</h1>
        <p>Sistema médico de escritorio</p>

        <label>Usuario</label>
        <input
          type="text"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          placeholder="admin"
          autoComplete="username"
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="admin123"
          autoComplete="current-password"
        />

        {mensajeError && <div className="error-message">{mensajeError}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}