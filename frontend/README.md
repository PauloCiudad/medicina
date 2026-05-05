# Frontend - Sistema Médico SERUMS

Frontend de escritorio desarrollado con React, Vite y Electron.

---

## Tecnologías

- React
- Vite
- Electron
- Axios
- Zustand
- React Router DOM
- CSS personalizado

---

## Arquitectura

```txt
frontend/
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
│   └── styles/
│
└── package.json
```

---

## Electron

El proyecto usa Electron para convertir el frontend React en una aplicación de escritorio.

```txt
electron/main.cjs     → Ventana principal
electron/preload.cjs  → Puente seguro
src/                  → React renderer
```

---

## Router

Se usa `HashRouter` para evitar pantalla en blanco al empaquetar Electron.

Rutas principales:

```txt
/dashboard
/pacientes
/pacientes/listado
/consultas
/recetas
/medicamentos
/inventario
```

---

## Axios

El cliente Axios se encuentra en:

```txt
src/api/apiClient.js
```

Se encarga de:

- Definir la URL base del backend.
- Adjuntar token JWT automáticamente.
- Cerrar sesión si recibe error 401.

---

## Estado global

Se usa Zustand para manejar sesión:

```txt
src/store/authStore.js
```

Guarda:

- token
- usuario
- estado de autenticación

---

## Ejecutar frontend

```bash
npm install
npm run dev
```

Esto levanta:

```txt
Vite + React
Electron desktop app
```

---

## Requisitos

Antes de iniciar sesión, el backend debe estar activo en:

```txt
http://localhost:3000/api
```

---

## Login

```txt
Usuario: admin
Contraseña: admin123
```