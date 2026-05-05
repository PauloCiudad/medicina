# Sistema Médico

Sistema fullstack de escritorio para la gestión médica básica de un doctor en etapa SERUMS.  
Permite registrar pacientes, antecedentes, consultas médicas, diagnósticos CIE10, recetas, medicamentos e inventario.

El sistema está compuesto por:

- Backend monolítico modular con Node.js, Express y MySQL.
- Base de datos MySQL ejecutada en Docker.
- Frontend de escritorio con React, Vite y Electron.
- Consumo de API mediante Axios.
- Autenticación con JWT.

---

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- MySQL
- mysql2/promise
- CORS
- dotenv
- bcryptjs
- jsonwebtoken
- Docker
- Docker Compose

### Frontend

- React
- Vite
- Electron
- Axios
- React Router DOM
- Zustand
- CSS personalizado

### Base de datos

- MySQL 8.0
- Tabla CIE10 importada desde Excel oficial del MINSA
- Control de inventario por movimientos

---

## Estructura general del proyecto

```txt
medicina/
│
├── backend/
│   │
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── routes/
│   │   │   └── index.routes.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   └── response.js
│   │   │
│   │   └── modules/
│   │       ├── auth/
│   │       ├── pacientes/
│   │       ├── antecedentes/
│   │       ├── consultas/
│   │       ├── cie10/
│   │       ├── recetas/
│   │       ├── medicamentos/
│   │       └── inventario/
│   │
│   ├── database/
│   │   ├── serums_schema_comentado.sql
│   │   └── cie10_minsa_insert.sql
│   │
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env
│
└── frontend/
    │
    ├── electron/
    │   ├── main.cjs
    │   └── preload.cjs
    │
    ├── src/
    │   ├── api/
    │   ├── router/
    │   ├── layouts/
    │   ├── store/
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   ├── pacientes/
    │   │   ├── antecedentes/
    │   │   ├── consultas/
    │   │   ├── cie10/
    │   │   ├── recetas/
    │   │   ├── medicamentos/
    │   │   └── inventario/
    │   │
    │   └── styles/
    │       └── globals.css
    │
    ├── package.json
    └── vite.config.js