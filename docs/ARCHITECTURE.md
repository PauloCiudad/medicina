# Arquitectura del sistema

El Sistema Médico SERUMS está dividido en dos aplicaciones principales:

```txt
backend  → API REST + MySQL
frontend → React + Electron
```

---

## Arquitectura general

```txt
Electron Desktop App
        ↓
React + Axios
        ↓
Backend Express
        ↓
MySQL Docker
```

---

## Backend

El backend es un monolito modular.

Flujo interno:

```txt
routes → controller → service → repository → database
```

---

## Responsabilidades

### routes

Define endpoints.

### controller

Recibe la petición HTTP y devuelve respuesta.

### service

Contiene reglas de negocio.

### repository

Ejecuta consultas SQL.

### database

Guarda la información en MySQL.

---

## Frontend

El frontend usa React con arquitectura modular.

```txt
src/modules/
├── auth/
├── dashboard/
├── pacientes/
├── antecedentes/
├── consultas/
├── cie10/
├── recetas/
├── medicamentos/
└── inventario/
```

Cada módulo puede tener:

```txt
pages/
services/
components/
hooks/
```

---

## Electron

Electron se divide en:

```txt
main.cjs     → Proceso principal
preload.cjs  → Puente seguro
React        → Interfaz
```

Configuración recomendada:

```js
contextIsolation: true
nodeIntegration: false
```

---

## Autenticación

```txt
Login
  ↓
Backend valida usuario
  ↓
Backend genera JWT
  ↓
Frontend guarda token
  ↓
Axios envía token en cada request
```

---

## Inventario

El inventario se controla mediante movimientos.

```txt
ENTRADA → aumenta stock
SALIDA  → disminuye stock
AJUSTE  → corrige stock
```

Además, cuando una receta tiene `cantidad_entregada > 0`, se genera automáticamente una salida de inventario.