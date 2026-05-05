# Seguridad

Notas de seguridad del Sistema Médico SERUMS.

---

## Autenticación

El sistema usa JWT para proteger rutas privadas.

```txt
Authorization: Bearer TOKEN
```

---

## Contraseñas

Las contraseñas se almacenan encriptadas con bcryptjs.

Nunca guardar contraseñas en texto plano.

---

## Variables sensibles

No subir archivos `.env` al repositorio.

Agregar en `.gitignore`:

```txt
.env
node_modules
dist
```

---

## Electron

Configuración recomendada:

```js
contextIsolation: true
nodeIntegration: false
```

---

## Base de datos

Recomendaciones:

- Usar contraseñas seguras.
- No exponer MySQL públicamente.
- Realizar backups.
- Mantener eliminaciones lógicas.
- Validar datos antes de insertar.

---

## JWT Secret

Cambiar en producción:

```env
JWT_SECRET=clave_segura_y_larga
```

---

## Reporte de vulnerabilidades

Si se detecta una vulnerabilidad, corregir antes de publicar o distribuir la aplicación.