# Base de datos

La base de datos del Sistema Médico SERUMS usa MySQL 8.0.

---

## Tablas principales

```txt
rol
usuario
PACIENTE
antecedente_catalogo
paciente_antecedente
consulta
consulta_signos_vitales
cie10
medicamento
receta
inventario_movimiento
auditoria_log
```

---

## Pacientes

Tabla principal:

```txt
PACIENTE
```

Guarda datos personales, alergias y campos complementarios.

---

## Antecedentes

Los antecedentes se manejan con dos tablas:

```txt
antecedente_catalogo
paciente_antecedente
```

Catálogo base:

```txt
Hipertensión
Diabetes
Hipertiroidismo
Hipotiroidismo
Otros
```

`paciente_antecedente` separa antecedentes:

```txt
FAMILIAR
PATOLOGICO
```

---

## Consultas

Tabla:

```txt
consulta
```

Guarda:

- paciente
- motivo de consulta
- diagnóstico CIE10
- medicación sí/no
- estado activo
- fechas

---

## Signos vitales

Tabla:

```txt
consulta_signos_vitales
```

Guarda:

- peso
- talla
- temperatura
- presión arterial
- frecuencia cardiaca
- frecuencia respiratoria
- saturación de oxígeno

---

## CIE10

Tabla:

```txt
cie10
```

Guarda diagnósticos oficiales:

- código
- descripción
- capítulo
- grupo

---

## Medicamentos

Tabla:

```txt
medicamento
```

Guarda:

- nombre
- cantidad o presentación
- stock

---

## Recetas

Tabla:

```txt
receta
```

Guarda:

- consulta
- medicamento
- dosis
- frecuencia
- duración
- vía de administración
- cantidad entregada
- indicaciones

---

## Inventario

Tabla:

```txt
inventario_movimiento
```

Tipos:

```txt
ENTRADA
SALIDA
AJUSTE
```

---

## Eliminación lógica

Las tablas principales usan:

```txt
activo = 1
activo = 0
```

Esto permite ocultar registros sin borrarlos físicamente.

---

## Charset recomendado

```txt
utf8mb4
utf8mb4_unicode_ci
```