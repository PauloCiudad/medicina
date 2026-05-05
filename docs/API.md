# API del Sistema Médico SERUMS

Base URL:

```txt
http://localhost:3000/api
```

---

## Auth

### Login

```txt
POST /auth/login
```

Body:

```json
{
  "usuario": "admin",
  "password": "admin123"
}
```

---

### Perfil

```txt
GET /auth/me
```

Header:

```txt
Authorization: Bearer TOKEN
```

---

## Pacientes

```txt
GET    /pacientes
GET    /pacientes/:id
POST   /pacientes
PUT    /pacientes/:id
DELETE /pacientes/:id
```

---

## Antecedentes

```txt
GET  /antecedentes/catalogo
GET  /antecedentes/paciente/:idPaciente
POST /antecedentes/paciente/:idPaciente
```

Body ejemplo:

```json
{
  "antecedentes_familiares": [1, 2],
  "antecedentes_patologicos": [2, 5],
  "otros_antecedentes_fam": null,
  "otros_antecedentes_pat": "Asma en infancia"
}
```

---

## Consultas

```txt
GET    /consultas
GET    /consultas/:id
GET    /consultas/paciente/:idPaciente
POST   /consultas
PUT    /consultas/:id
DELETE /consultas/:id
```

Body ejemplo:

```json
{
  "id_paciente": 1,
  "motivo_consulta": "Dolor de garganta y fiebre",
  "diagnostico": 123,
  "medicacion": 1,
  "signos_vitales": {
    "peso": 72.5,
    "talla": 1.68,
    "temperatura": 37.2,
    "presion_arterial": "120/80",
    "frecuencia_cardiaca": 78,
    "frecuencia_respiratoria": 18,
    "saturacion_oxigeno": 98
  }
}
```

---

## CIE10

```txt
GET /cie10/buscar?q=gripe
GET /cie10/buscar?q=J00
GET /cie10/:id
```

---

## Recetas

```txt
GET    /recetas
GET    /recetas/:id
GET    /recetas/consulta/:idConsulta
GET    /recetas/paciente/:idPaciente
POST   /recetas
PUT    /recetas/:id
DELETE /recetas/:id
```

Body ejemplo:

```json
{
  "id_consulta": 1,
  "id_medicamento": 1,
  "dosis": "1 tableta",
  "frecuencia": "Cada 8 horas",
  "duracion": "3 días",
  "via_administracion": "Oral",
  "cantidad_entregada": 6,
  "indicaciones": "Tomar después de los alimentos"
}
```

---

## Medicamentos

```txt
GET    /medicamentos
GET    /medicamentos/:id
GET    /medicamentos/buscar?q=paracetamol
GET    /medicamentos/stock-bajo?limite=10
POST   /medicamentos
PUT    /medicamentos/:id
DELETE /medicamentos/:id
```

---

## Inventario

```txt
GET  /inventario/movimientos
GET  /inventario/medicamento/:idMedicamento/movimientos
POST /inventario/entrada
POST /inventario/salida
POST /inventario/ajuste
```

Entrada:

```json
{
  "id_medicamento": 1,
  "cantidad": 20,
  "motivo": "Ingreso inicial"
}
```

Salida:

```json
{
  "id_medicamento": 1,
  "cantidad": 5,
  "motivo": "Salida manual"
}
```

Ajuste:

```json
{
  "id_medicamento": 1,
  "nuevo_stock": 100,
  "motivo": "Corrección por conteo físico"
}
```