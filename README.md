# Sistema Médico SERUMS

Sistema fullstack de escritorio para la gestión médica básica de un doctor en etapa SERUMS.

Permite registrar pacientes, antecedentes, consultas médicas, diagnósticos CIE10, recetas, medicamentos e inventario.

---

## Tecnologías principales

### Backend

- Node.js
- Express
- MySQL
- Docker
- JWT
- bcryptjs
- mysql2/promise

### Frontend

- React
- Vite
- Electron
- Axios
- Zustand
- React Router DOM

### Base de datos

- MySQL 8.0
- Tabla CIE10 cargada desde archivo oficial del MINSA
- Control de inventario mediante movimientos

---

## Estructura general

```txt
serums-system/
│
├── backend/
│   ├── src/
│   ├── database/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend/
│   ├── electron/
│   ├── src/
│   └── package.json
│
└── docs/
```

---

## Módulos del sistema

- Login con JWT
- Dashboard
- Pacientes
- Antecedentes familiares y patológicos
- Consultas médicas
- Diagnóstico CIE10
- Recetas médicas
- Medicamentos
- Inventario
- Salida automática de stock por receta

---

## Documentación

| Documento | Descripción |
|---|---|
| [Instalación](docs/INSTALLATION.md) | Pasos para instalar y ejecutar el proyecto |
| [Arquitectura](docs/ARCHITECTURE.md) | Arquitectura backend, frontend y flujo general |
| [Base de datos](docs/DATABASE.md) | Tablas, relaciones y lógica de datos |
| [API](docs/API.md) | Endpoints principales del backend |
| [CIE10](docs/CIE10.md) | Carga y uso de diagnósticos CIE10 |
| [Guía de usuario](docs/USER_GUIDE.md) | Uso funcional del sistema |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Errores comunes y soluciones |
| [Roadmap](docs/ROADMAP.md) | Mejoras futuras |

---

## Ejecución rápida

### Backend

```bash
cd backend
docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Login inicial

```txt
Usuario: admin
Contraseña: admin123
```

El usuario debe ser creado previamente en la base de datos usando un hash generado con bcryptjs.

---

## Autor

Proyecto desarrollado como sistema médico de escritorio para apoyo en atención SERUMS.