import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const menuPrincipal = [
  {
    label: "Dashboard",
    path: "/dashboard",
    description: "Resumen general",
  },
  {
    label: "Registrar paciente",
    path: "/pacientes",
    description: "Nuevo paciente",
  },
  {
    label: "Registro de pacientes",
    path: "/pacientes/listado",
    description: "Listado general",
  },
  {
    label: "Consultas",
    path: "/consultas",
    description: "Consultas médicas",
  },
  {
    label: "Recetas",
    path: "/recetas",
    description: "Recetas médicas",
  },
  {
    label: "Medicamentos",
    path: "/medicamentos",
    description: "Catálogo y stock",
  },
  {
    label: "Inventario",
    path: "/inventario",
    description: "Entradas y salidas",
  },
];

const getPageTitle = (pathname) => {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/pacientes") return "Registrar paciente";
  if (pathname === "/pacientes/listado") return "Registro de pacientes";
  if (pathname.includes("/pacientes/") && pathname.includes("/editar")) return "Editar paciente";
  if (pathname.includes("/consultas/nueva")) return "Nueva consulta";
  if (pathname.includes("/consultas") && pathname.includes("/pacientes")) return "Consultas del paciente";
  if (pathname.includes("/consultas/") && pathname.includes("/editar")) return "Editar consulta";
  if (pathname.includes("/consultas/") && pathname.includes("/recetas")) return "Recetas de consulta";
  if (pathname === "/consultas") return "Consultas médicas";
  if (pathname === "/recetas") return "Recetas médicas";
  if (pathname === "/medicamentos") return "Medicamentos";
  if (pathname === "/inventario") return "Inventario";

  return "Sistema SERUMS";
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">S</div>

          <div>
            <h2>SERUMS</h2>
            <span>Sistema médico</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-title">Principal</span>

          <nav className="menu">
            {menuPrincipal.map((item) => (
              <NavLink key={item.path} to={item.path}>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-box">
            <div className="user-avatar">S</div>

            <div>
              <strong>Modo local</strong>
              <span>Base de datos independiente</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">SERUMS / {pageTitle}</span>
            <h1>{pageTitle}</h1>
          </div>

          <div className="topbar-actions">
            <button onClick={() => navigate("/pacientes")}>
              Nuevo paciente
            </button>

            <button onClick={() => navigate("/pacientes/listado")}>
              Ver pacientes
            </button>
          </div>
        </header>

        <section className="main-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}