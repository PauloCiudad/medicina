# Backend - Sistema Médico SERUMS

Backend monolítico modular desarrollado con Node.js, Express y MySQL.

---

## Tecnologías

- Node.js
- Express
- MySQL
- mysql2/promise
- Docker
- Docker Compose
- dotenv
- cors
- bcryptjs
- jsonwebtoken

---

## Arquitectura

El backend usa el siguiente flujo:

```txt
routes → controller → service → repository → MySQL
```

Cada módulo tiene su propia estructura:

```txt
modules/
└── pacientes/
    ├── pacientes.routes.js
    ├── pacientes.controller.js
    ├── pacientes.service.js
    └── pacientes.repository.js
```

---

## Módulos

```txt
auth
pacientes
antecedentes
consultas
cie10
recetas
medicamentos
inventario
```

---

## Variables de entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=3000

DB_HOST=mysql
DB_PORT=3306
DB_USER=serums_user
DB_PASSWORD=serums_pass
DB_NAME=serums_db

JWT_SECRET=clave_super_secreta_serums
JWT_EXPIRES_IN=8h
```

---

## Ejecutar backend

```bash
docker compose up --build
```

---

## Reiniciar base de datos

Este comando elimina el volumen de MySQL y vuelve a cargar el SQL inicial.

```bash
docker compose down -v
docker compose up --build
```

---

## Probar salud del backend

```txt
GET http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "message": "Backend SERUMS funcionando correctamente"
}
```

---

## Crear hash de contraseña

```bash
node --input-type=module -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('admin123', 10));"
```

---

## Crear usuario admin

```sql
INSERT INTO usuario (
    id_rol,
    nombres,
    apellidos,
    usuario,
    password_hash,
    email,
    activo
) VALUES (
    1,
    'Administrador',
    'SERUMS',
    'admin',
    'AQUI_PEGA_EL_HASH_GENERADO',
    'admin@serums.local',
    1
);
```

---

## Rutas públicas

```txt
GET  /api/health
POST /api/auth/login
```

---

## Rutas protegidas

Todas las demás rutas requieren token JWT.

```txt
Authorization: Bearer TOKEN_JWT
```