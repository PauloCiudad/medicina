# Instalación del proyecto

Guía para instalar y ejecutar el Sistema Médico SERUMS.

---

## Requisitos previos

Instalar:

- Node.js
- npm
- Docker Desktop
- Git
- Visual Studio Code
- Postman opcional
- MySQL Workbench o DBeaver opcional

---

## Clonar repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd serums-system
```

---

## Configurar backend

Entrar al backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env`:

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

Levantar backend y MySQL:

```bash
docker compose up --build
```

---

## Validar backend

```txt
GET http://localhost:3000/api/health
```

---

## Configurar usuario administrador

Generar hash:

```bash
node --input-type=module -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('admin123', 10));"
```

Insertar usuario:

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

## Cargar CIE10

Copiar el archivo:

```txt
cie10_minsa_insert.sql
```

en:

```txt
backend/database/
```

Cargar con PowerShell:

```powershell
Get-Content .\database\cie10_minsa_insert.sql | docker exec -i serums_mysql mysql -u serums_user -pserums_pass serums_db
```

Validar:

```sql
SELECT COUNT(*) FROM cie10;
```

---

## Configurar frontend

Entrar al frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

---

## Flujo de prueba

```txt
1. Levantar backend.
2. Crear usuario admin.
3. Cargar CIE10.
4. Levantar frontend.
5. Iniciar sesión.
6. Registrar paciente.
7. Registrar consulta.
8. Seleccionar diagnóstico CIE10.
9. Registrar receta.
10. Validar descuento de stock.
```