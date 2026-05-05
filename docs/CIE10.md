# CIE10

El sistema usa la tabla CIE10 para registrar diagnósticos médicos.

---

## Fuente

Los datos fueron preparados desde un Excel oficial del MINSA.

---

## Tabla

```txt
cie10
```

Campos principales:

```txt
id
codigo
descripcion
capitulo
grupo
activo
created_at
```

---

## Carga de datos

Archivo recomendado:

```txt
backend/database/cie10_minsa_insert.sql
```

Cargar con PowerShell:

```powershell
Get-Content .\database\cie10_minsa_insert.sql | docker exec -i serums_mysql mysql -u serums_user -pserums_pass serums_db
```

Cargar con CMD:

```cmd
type database\cie10_minsa_insert.sql | docker exec -i serums_mysql mysql -u serums_user -pserums_pass serums_db
```

---

## Validar cantidad

```sql
SELECT COUNT(*) FROM cie10;
```

---

## Buscar diagnóstico

Endpoint:

```txt
GET /api/cie10/buscar?q=gripe
```

Por código:

```txt
GET /api/cie10/buscar?q=J00
```

---

## Uso en consultas

La tabla `consulta` guarda:

```txt
diagnostico = cie10.id
```

Esto permite mostrar:

```txt
codigo
descripcion
capitulo
grupo
```

---

## Ejemplo funcional

```txt
Motivo de consulta:
Dolor de garganta y fiebre

Diagnóstico CIE10:
J00 - Rinofaringitis aguda
```