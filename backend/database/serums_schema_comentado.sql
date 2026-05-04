/*
================================================================================
 PROYECTO: Sistema SERUMS - Backend Node.js + Express + MySQL + React
 ARCHIVO : serums_schema_comentado.sql
 MOTOR   : MySQL
 AUTOR   : Paulo Ciudad
 FECHA   : 2026-05-04

 OBJETIVO:
 Este archivo documenta y prepara la estructura de base de datos trabajada
 hasta ahora para el sistema médico de un doctor en SERUMS.

 El modelo base proporcionado por el usuario NO se elimina ni se reemplaza.
 Se mantiene la estructura principal:
   - PACIENTE
   - consulta
   - receta
   - medicamento

 Además, se agregan tablas de apoyo necesarias para:
   - Usuarios y roles del sistema
   - Selección múltiple de antecedentes familiares y patológicos
   - Catálogo CIE10 para diagnósticos del MINSA, actualmente en standby
   - Signos vitales por consulta
   - Movimientos de inventario de medicamentos
   - Auditoría básica del sistema

 NOTA IMPORTANTE:
 La tabla CIE10 queda preparada, pero su carga final se hará cuando se reciba
 el Excel del MINSA. La columna consulta.diagnostico se maneja como referencia
 lógica al catálogo CIE10.
================================================================================
*/
CREATE DATABASE IF NOT EXISTS serums_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE serums_db;
/*
================================================================================
 1. TABLA: rol
 --------------------------------------------------------------------------------
 Define los roles de los usuarios del sistema.
 Ejemplos:
   - ADMIN: administrador del sistema
   - DOCTOR: médico que registra pacientes, consultas y recetas
================================================================================
*/
CREATE TABLE IF NOT EXISTS rol (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rol',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del rol: ADMIN, DOCTOR, etc.',
    descripcion VARCHAR(255) NULL COMMENT 'Descripción funcional del rol',
    activo TINYINT DEFAULT 1 COMMENT '1 = activo, 0 = inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',

    UNIQUE KEY uk_rol_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de roles para controlar permisos del sistema';

/*
================================================================================
 2. TABLA: usuario
 --------------------------------------------------------------------------------
 Usuarios que podrán ingresar al sistema.
 Se usará para login con JWT desde el backend Node.js.
 La contraseña NO se guarda en texto plano; se guarda como hash.
================================================================================
*/
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    id_rol BIGINT NOT NULL COMMENT 'Rol asignado al usuario',
    nombres VARCHAR(150) NOT NULL COMMENT 'Nombres del usuario',
    apellidos VARCHAR(150) NULL COMMENT 'Apellidos del usuario',
    usuario VARCHAR(100) NOT NULL COMMENT 'Nombre de usuario para login',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con bcrypt',
    email VARCHAR(150) NULL COMMENT 'Correo electrónico del usuario',
    activo TINYINT DEFAULT 1 COMMENT '1 = activo, 0 = inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del usuario',
    updated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha de última actualización del usuario',

    UNIQUE KEY uk_usuario_usuario (usuario),
    KEY idx_usuario_rol (id_rol),

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuarios del sistema SERUMS';

/*
================================================================================
 3. TABLA BASE: PACIENTE
 --------------------------------------------------------------------------------
 Tabla principal de pacientes.
 Se respeta el modelo entregado por el usuario.

 Campos importantes:
   - antecedentes_fam / antecedentes_pat:
       Se mantienen en la tabla, pero la selección múltiple recomendada se manejará
       mediante la tabla paciente_antecedente.
   - otros_antecedentes_fam / otros_antecedentes_pat:
       Se llenan cuando el médico selecciona la opción OTROS.
   - sexo:
       Se mantiene como INTEGER según el ERD.
       Más adelante se puede definir la convención, por ejemplo:
         1 = Masculino
         2 = Femenino
         3 = Otro / No especifica
================================================================================
*/
CREATE TABLE IF NOT EXISTS PACIENTE (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del paciente',
    DNI NUMERIC(12,0) NULL COMMENT 'Documento de identidad del paciente. Se respeta como NUMERIC según el ERD',
    nombre VARCHAR(150) NOT NULL COMMENT 'Primer nombre del paciente',
    nombre_2 VARCHAR(150) NULL COMMENT 'Segundo nombre del paciente',
    apellido_pat VARCHAR(150) NULL COMMENT 'Apellido paterno del paciente',
    apellido_mat VARCHAR(150) NULL COMMENT 'Apellido materno del paciente',
    edad INT NULL COMMENT 'Edad del paciente',
    antecedentes_fam VARCHAR(500) NULL COMMENT 'Campo base/resumen para antecedentes familiares. La selección múltiple se controla en paciente_antecedente',
    otros_antecedentes_fam VARCHAR(500) NULL COMMENT 'Detalle escrito por el médico cuando antecedentes familiares incluye OTROS',
    antecedentes_pat VARCHAR(500) NULL COMMENT 'Campo base/resumen para antecedentes patológicos. La selección múltiple se controla en paciente_antecedente',
    otros_antecedentes_pat VARCHAR(500) NULL COMMENT 'Detalle escrito por el médico cuando antecedentes patológicos incluye OTROS',
    sexo INTEGER NULL COMMENT 'Sexo del paciente. Convención pendiente de definir',
    alergias VARCHAR(500) NULL COMMENT 'Alergias conocidas del paciente',

    activo TINYINT DEFAULT 1 COMMENT '1 = paciente activo, 0 = paciente inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro del paciente',
    updated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha de última actualización del paciente',

    KEY idx_paciente_dni (DNI),
    KEY idx_paciente_nombre (nombre, apellido_pat, apellido_mat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla principal de pacientes';

/*
================================================================================
 4. TABLA: antecedente_catalogo
 --------------------------------------------------------------------------------
 Catálogo de antecedentes disponibles para selección múltiple.
 Valores iniciales definidos por el usuario:
   - Hipertensión
   - Diabetes
   - Hipertiroidismo
   - Hipotiroidismo
   - Otros

 Esta tabla evita guardar varios valores mezclados en un solo VARCHAR.
================================================================================
*/
CREATE TABLE IF NOT EXISTS antecedente_catalogo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del antecedente',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del antecedente',
    activo TINYINT DEFAULT 1 COMMENT '1 = activo, 0 = inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del antecedente',

    UNIQUE KEY uk_antecedente_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de antecedentes familiares y patológicos';

/*
================================================================================
 5. TABLA: paciente_antecedente
 --------------------------------------------------------------------------------
 Relaciona pacientes con antecedentes.
 Permite que un paciente tenga varios antecedentes familiares y/o patológicos.

 Campo tipo:
   - FAMILIAR   : antecedentes familiares
   - PATOLOGICO : antecedentes patológicos/personales

 Ejemplo:
   Paciente 1 - Hipertensión - FAMILIAR
   Paciente 1 - Diabetes     - PATOLOGICO
================================================================================
*/
CREATE TABLE IF NOT EXISTS paciente_antecedente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la relación paciente-antecedente',
    id_paciente BIGINT NOT NULL COMMENT 'Paciente al que pertenece el antecedente',
    id_antecedente BIGINT NOT NULL COMMENT 'Antecedente seleccionado desde antecedente_catalogo',
    tipo ENUM('FAMILIAR', 'PATOLOGICO') NOT NULL COMMENT 'Tipo de antecedente: familiar o patológico',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro de la relación',

    UNIQUE KEY uk_paciente_antecedente_tipo (id_paciente, id_antecedente, tipo),
    KEY idx_paciente_antecedente_paciente (id_paciente),
    KEY idx_paciente_antecedente_catalogo (id_antecedente),

    CONSTRAINT fk_paciente_antecedente_paciente
        FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_paciente_antecedente_catalogo
        FOREIGN KEY (id_antecedente) REFERENCES antecedente_catalogo(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Relación de pacientes con antecedentes seleccionados';

/*
================================================================================
 6. TABLA: cie10
 --------------------------------------------------------------------------------
 Catálogo CIE10 del MINSA.
 Actualmente queda en standby hasta recibir el Excel oficial.

 Uso esperado:
   - El médico seleccionará un diagnóstico desde este catálogo.
   - consulta.diagnostico guardará el ID del diagnóstico seleccionado.

 Cuando se entregue el Excel, se creará un proceso de importación/carga masiva.
================================================================================
*/
CREATE TABLE IF NOT EXISTS cie10 (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único interno del diagnóstico CIE10',
    codigo VARCHAR(20) NOT NULL COMMENT 'Código CIE10, por ejemplo J00, A09, E11',
    descripcion VARCHAR(500) NOT NULL COMMENT 'Descripción del diagnóstico CIE10',
    capitulo VARCHAR(255) NULL COMMENT 'Capítulo CIE10, si viene en el Excel',
    grupo VARCHAR(255) NULL COMMENT 'Grupo o categoría CIE10, si viene en el Excel',
    activo TINYINT DEFAULT 1 COMMENT '1 = activo, 0 = inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de carga del diagnóstico',

    UNIQUE KEY uk_cie10_codigo (codigo),
    KEY idx_cie10_descripcion (descripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de diagnósticos CIE10 del MINSA';

/*
================================================================================
 7. TABLA BASE: medicamento
 --------------------------------------------------------------------------------
 Tabla principal de medicamentos.
 Se respeta el modelo entregado por el usuario.

 Campo cantidad:
   Se mantiene como VARCHAR porque representa presentación/concentración.
   Ejemplos:
     - 500 mg
     - 250 mg/5 ml
     - 1 g

 Campo stock:
   Representa el stock actual disponible.
   Los cambios de stock se documentan en inventario_movimiento.
================================================================================
*/
CREATE TABLE IF NOT EXISTS medicamento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del medicamento',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre del medicamento',
    cantidad VARCHAR(100) NULL COMMENT 'Presentación o concentración del medicamento, por ejemplo 500 mg',
    stock INT DEFAULT 0 COMMENT 'Stock actual disponible del medicamento',

    activo TINYINT DEFAULT 1 COMMENT '1 = medicamento activo, 0 = medicamento inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del medicamento',
    updated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha de última actualización del medicamento',

    KEY idx_medicamento_nombre (nombre),
    KEY idx_medicamento_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo e inventario principal de medicamentos';

/*
================================================================================
 8. TABLA BASE: consulta
 --------------------------------------------------------------------------------
 Tabla principal de consultas médicas.
 Se respeta el modelo entregado por el usuario.

 Campo medicacion:
   Es booleano según la explicación del usuario:
     0 = No se entrega medicación
     1 = Sí se entrega medicación

 Campo diagnostico:
   Será referencia al catálogo CIE10 del MINSA.
   Por ahora queda preparado para relacionarse con cie10.id.
================================================================================
*/
CREATE TABLE IF NOT EXISTS consulta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la consulta médica',
    id_paciente BIGINT NOT NULL COMMENT 'Paciente atendido en la consulta',
    motivo_consulta VARCHAR(500) NULL COMMENT 'Motivo principal de la consulta',
    diagnostico BIGINT NULL COMMENT 'ID del diagnóstico CIE10 seleccionado. En standby hasta cargar Excel MINSA',
    fecha_atencion DATE NULL COMMENT 'Fecha de atención médica',
    medicacion TINYINT DEFAULT 0 COMMENT '0 = sin medicación, 1 = con medicación',

    activo TINYINT DEFAULT 1 COMMENT '1 = consulta activa, 0 = consulta anulada/inactiva',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la consulta',
    updated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha de última actualización de la consulta',

    KEY idx_consulta_paciente (id_paciente),
    KEY idx_consulta_fecha (fecha_atencion),
    KEY idx_consulta_diagnostico (diagnostico),

    CONSTRAINT fk_consulta_paciente
        FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_consulta_cie10
        FOREIGN KEY (diagnostico) REFERENCES cie10(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Consultas médicas realizadas a los pacientes';

/*
================================================================================
 9. TABLA: consulta_signos_vitales
 --------------------------------------------------------------------------------
 Registra signos vitales asociados a una consulta médica.
 Se separa de consulta para no sobrecargar la tabla principal.

 Campos clínicos básicos:
   - peso
   - talla
   - temperatura
   - presión arterial
   - frecuencia cardiaca
   - frecuencia respiratoria
   - saturación de oxígeno
================================================================================
*/
CREATE TABLE IF NOT EXISTS consulta_signos_vitales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de los signos vitales',
    id_consulta BIGINT NOT NULL COMMENT 'Consulta médica asociada',
    peso DECIMAL(5,2) NULL COMMENT 'Peso del paciente en kilogramos',
    talla DECIMAL(5,2) NULL COMMENT 'Talla del paciente en metros o centímetros según convención del sistema',
    temperatura DECIMAL(4,2) NULL COMMENT 'Temperatura corporal',
    presion_arterial VARCHAR(20) NULL COMMENT 'Presión arterial, por ejemplo 120/80',
    frecuencia_cardiaca INT NULL COMMENT 'Frecuencia cardiaca por minuto',
    frecuencia_respiratoria INT NULL COMMENT 'Frecuencia respiratoria por minuto',
    saturacion_oxigeno INT NULL COMMENT 'Saturación de oxígeno en porcentaje',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro de signos vitales',

    UNIQUE KEY uk_signos_consulta (id_consulta),

    CONSTRAINT fk_signos_consulta
        FOREIGN KEY (id_consulta) REFERENCES consulta(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Signos vitales registrados durante una consulta médica';

/*
================================================================================
 10. TABLA BASE: receta
 --------------------------------------------------------------------------------
 Tabla de recetas médicas.
 Se respeta el modelo entregado por el usuario.

 Cada fila representa un medicamento recetado para una consulta.
 Ejemplo:
   Consulta 1 - Paracetamol - 1 tableta cada 8 horas
   Consulta 1 - Ibuprofeno  - 1 tableta cada 12 horas

 Se agregan campos médicos útiles sin alterar la lógica base:
   - frecuencia
   - duración
   - vía de administración
   - cantidad entregada
   - indicaciones
================================================================================
*/
CREATE TABLE IF NOT EXISTS receta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la receta/detalle de receta',
    id_consulta BIGINT NOT NULL COMMENT 'Consulta médica asociada a la receta',
    id_medicamento BIGINT NOT NULL COMMENT 'Medicamento recetado',
    dosis VARCHAR(150) NULL COMMENT 'Dosis indicada por el médico',

    frecuencia VARCHAR(100) NULL COMMENT 'Frecuencia de uso, por ejemplo cada 8 horas',
    duracion VARCHAR(100) NULL COMMENT 'Duración del tratamiento, por ejemplo 3 días',
    via_administracion VARCHAR(100) NULL COMMENT 'Vía de administración, por ejemplo oral, tópica, intramuscular',
    cantidad_entregada INT DEFAULT 0 COMMENT 'Cantidad entregada al paciente desde inventario',
    indicaciones TEXT NULL COMMENT 'Indicaciones adicionales para el paciente',

    activo TINYINT DEFAULT 1 COMMENT '1 = receta activa, 0 = receta anulada/inactiva',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la receta',
    updated_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Fecha de última actualización de la receta',

    KEY idx_receta_consulta (id_consulta),
    KEY idx_receta_medicamento (id_medicamento),

    CONSTRAINT fk_receta_consulta
        FOREIGN KEY (id_consulta) REFERENCES consulta(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_receta_medicamento
        FOREIGN KEY (id_medicamento) REFERENCES medicamento(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Recetas médicas y medicamentos indicados por consulta';

/*
================================================================================
 11. TABLA: inventario_movimiento
 --------------------------------------------------------------------------------
 Registra los movimientos de stock de medicamentos.
 No basta con tener medicamento.stock, porque se necesita saber por qué subió
 o bajó el stock.

 Tipos de movimiento:
   - ENTRADA: ingreso de medicamentos al inventario
   - SALIDA : entrega de medicamentos al paciente por receta
   - AJUSTE : corrección manual del stock

 La actualización de medicamento.stock puede hacerse desde el backend o más
 adelante mediante triggers si se decide automatizarlo en base de datos.
================================================================================
*/
CREATE TABLE IF NOT EXISTS inventario_movimiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del movimiento de inventario',
    id_medicamento BIGINT NOT NULL COMMENT 'Medicamento afectado por el movimiento',
    id_usuario BIGINT NULL COMMENT 'Usuario que registró el movimiento',
    id_consulta BIGINT NULL COMMENT 'Consulta relacionada, si el movimiento es una salida por atención',
    id_receta BIGINT NULL COMMENT 'Receta relacionada, si el movimiento es una salida por medicamento recetado',
    tipo_movimiento ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL COMMENT 'Tipo de movimiento de inventario',
    cantidad INT NOT NULL COMMENT 'Cantidad del movimiento. Debe ser mayor a cero',
    motivo VARCHAR(255) NULL COMMENT 'Motivo o descripción del movimiento',
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del movimiento',

    KEY idx_inv_mov_medicamento (id_medicamento),
    KEY idx_inv_mov_usuario (id_usuario),
    KEY idx_inv_mov_consulta (id_consulta),
    KEY idx_inv_mov_receta (id_receta),
    KEY idx_inv_mov_fecha (fecha_movimiento),

    CONSTRAINT fk_inv_mov_medicamento
        FOREIGN KEY (id_medicamento) REFERENCES medicamento(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_inv_mov_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_inv_mov_consulta
        FOREIGN KEY (id_consulta) REFERENCES consulta(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_inv_mov_receta
        FOREIGN KEY (id_receta) REFERENCES receta(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_inv_mov_cantidad
        CHECK (cantidad > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de entradas, salidas y ajustes del inventario de medicamentos';

/*
================================================================================
 12. TABLA: auditoria_log
 --------------------------------------------------------------------------------
 Registra acciones importantes del sistema.
 Permite saber quién creó, modificó o eliminó registros.

 Ejemplos de uso:
   - Usuario creó un paciente
   - Usuario modificó una consulta
   - Usuario anuló una receta
   - Usuario inició sesión
================================================================================
*/
CREATE TABLE IF NOT EXISTS auditoria_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del evento de auditoría',
    id_usuario BIGINT NULL COMMENT 'Usuario que realizó la acción',
    tabla_afectada VARCHAR(100) NULL COMMENT 'Nombre de la tabla afectada',
    id_registro BIGINT NULL COMMENT 'ID del registro afectado',
    accion ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN') NOT NULL COMMENT 'Tipo de acción realizada',
    descripcion TEXT NULL COMMENT 'Descripción detallada de la acción realizada',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del evento de auditoría',

    KEY idx_auditoria_usuario (id_usuario),
    KEY idx_auditoria_tabla (tabla_afectada),
    KEY idx_auditoria_fecha (fecha),

    CONSTRAINT fk_auditoria_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de auditoría de acciones importantes del sistema';

/*
================================================================================
 13. DATOS INICIALES
 --------------------------------------------------------------------------------
 Se insertan valores base para roles y antecedentes.
 INSERT IGNORE evita duplicados si el archivo se ejecuta más de una vez.
================================================================================
*/
INSERT IGNORE INTO rol (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('DOCTOR', 'Médico encargado de registrar pacientes, consultas y recetas');

INSERT IGNORE INTO antecedente_catalogo (nombre) VALUES
('Hipertensión'),
('Diabetes'),
('Hipertiroidismo'),
('Hipotiroidismo'),
('Otros');

/*
================================================================================
 14. RESUMEN DEL MODELO
 --------------------------------------------------------------------------------
 Relaciones principales:

   PACIENTE 1 ---- N consulta
   consulta 1 ---- 1 consulta_signos_vitales
   consulta 1 ---- N receta
   medicamento 1 ---- N receta
   medicamento 1 ---- N inventario_movimiento
   PACIENTE N ---- N antecedente_catalogo, mediante paciente_antecedente
   cie10 1 ---- N consulta, mediante consulta.diagnostico
   rol 1 ---- N usuario
   usuario 1 ---- N auditoria_log

 Módulos backend recomendados según esta base:
   - auth
   - usuarios
   - pacientes
   - antecedentes
   - consultas
   - cie10
   - recetas
   - medicamentos
   - inventario
   - auditoria
================================================================================
*/
