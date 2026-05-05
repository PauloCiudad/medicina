# Contribución

Guía para contribuir al proyecto.

---

## Flujo recomendado

1. Crear una rama nueva.
2. Realizar cambios.
3. Probar backend.
4. Probar frontend.
5. Subir cambios.
6. Crear pull request si aplica.

---

## Convención de ramas

```txt
feature/nombre-funcionalidad
fix/nombre-error
docs/nombre-documentacion
```

Ejemplos:

```txt
feature/pdf-receta
fix/login-token
docs/api-endpoints
```

---

## Convención de commits

```txt
feat: nueva funcionalidad
fix: corrección de error
docs: documentación
style: cambios visuales
refactor: mejora interna
test: pruebas
chore: tareas menores
```

Ejemplos:

```txt
feat: agregar buscador CIE10
fix: corregir descuento de stock
docs: actualizar README
```

---

## Reglas técnicas

- Mantener arquitectura modular.
- No mezclar lógica SQL en controllers.
- Usar services para reglas de negocio.
- Usar repositories para consultas SQL.
- Proteger rutas privadas con JWT.
- Validar datos antes de guardar.
- Mantener nombres claros en español.

---

## Pruebas mínimas

Antes de subir cambios validar:

```txt
Login
Pacientes
Consultas
CIE10
Recetas
Medicamentos
Inventario
Dashboard
```