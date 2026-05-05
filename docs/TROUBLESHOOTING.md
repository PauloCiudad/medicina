# Troubleshooting

Errores comunes y soluciones.

---

## Error: backend no conecta a MySQL

Verificar `.env`:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=serums_user
DB_PASSWORD=serums_pass
DB_NAME=serums_db
```

Si el backend corre dentro de Docker, no usar:

```txt
localhost
```

Usar:

```txt
mysql
```

---

## Error: tildes mal mostradas

Ejemplo:

```txt
HipertensiÃ³n
```

Solución:

En `docker-compose.yml`:

```yaml
command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

En `db.js`:

```js
charset: "utf8mb4"
```

---

## Error: no se carga SQL inicial

MySQL solo ejecuta scripts iniciales cuando el volumen se crea por primera vez.

Solución:

```bash
docker compose down -v
docker compose up --build
```

---

## Error 401 en frontend

Verificar que el usuario haya iniciado sesión.

Axios debe enviar:

```txt
Authorization: Bearer TOKEN
```

---

## Pantalla en blanco en Electron

Usar:

```txt
HashRouter
```

No usar:

```txt
BrowserRouter
```

---

## Error de importación en Vite

Ejemplo:

```txt
Failed to resolve import
```

Verificar:

- Nombre exacto del archivo
- Mayúsculas y minúsculas
- Ruta relativa correcta
- Que el archivo exista

---

## Error al buscar CIE10

Validar que la tabla tenga datos:

```sql
SELECT COUNT(*) FROM cie10;
```

Validar endpoint:

```txt
GET /api/cie10/buscar?q=J00
```

---

## Error de stock insuficiente

El sistema no permite entregar más medicamentos que el stock disponible.

Soluciones:

- Registrar entrada en inventario.
- Ajustar stock.
- Reducir cantidad entregada en receta.

---

## Error al crear receta

Verificar que exista:

- Consulta
- Medicamento
- Stock suficiente
- Token JWT vigente