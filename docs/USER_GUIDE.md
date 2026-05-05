# Guía de usuario

Guía funcional del Sistema Médico SERUMS.

---

## 1. Iniciar sesión

Ingresar con usuario y contraseña.

```txt
Usuario: admin
Contraseña: admin123
```

---

## 2. Dashboard

Muestra información general:

- Pacientes registrados
- Consultas
- Medicamentos
- Stock bajo
- Últimas consultas
- Movimientos recientes

---

## 3. Registrar paciente

Ir a:

```txt
Registrar paciente
```

Completar:

- DNI
- Nombre
- Apellidos
- Edad
- Sexo
- Alergias
- Antecedentes familiares
- Antecedentes patológicos

Si se selecciona "Otros", escribir el detalle correspondiente.

---

## 4. Ver pacientes

Ir a:

```txt
Registro de pacientes
```

Desde esta pantalla se puede:

- Editar paciente
- Eliminar paciente
- Ver consultas del paciente

---

## 5. Crear consulta

Desde el registro de pacientes:

```txt
Consultas → Nueva consulta
```

Completar:

- Motivo de consulta
- Diagnóstico CIE10
- Medicación sí/no
- Signos vitales

---

## 6. Crear receta

Desde una consulta:

```txt
Recetas
```

Completar:

- Medicamento
- Dosis
- Frecuencia
- Duración
- Vía
- Cantidad entregada
- Indicaciones

Si la cantidad entregada es mayor a 0, el sistema descuenta stock automáticamente.

---

## 7. Medicamentos

Permite registrar y administrar medicamentos.

Campos:

- Nombre
- Presentación
- Stock inicial

---

## 8. Inventario

Permite controlar stock mediante:

- Entrada
- Salida
- Ajuste

---

## 9. Recomendación de uso

Flujo recomendado:

```txt
Registrar paciente
  ↓
Registrar antecedentes
  ↓
Crear consulta
  ↓
Seleccionar CIE10
  ↓
Crear receta
  ↓
Validar inventario
```