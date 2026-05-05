PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS PACIENTE (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    DNI TEXT,
    nombre TEXT NOT NULL,
    nombre_2 TEXT,
    apellido_pat TEXT NOT NULL,
    apellido_mat TEXT,
    edad INTEGER,
    antecedentes_fam TEXT,
    otros_antecedentes_fam TEXT,
    antecedentes_pat TEXT,
    otros_antecedentes_pat TEXT,
    sexo INTEGER,
    alergias TEXT,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_paciente_dni ON PACIENTE(DNI);
CREATE INDEX IF NOT EXISTS idx_paciente_activo ON PACIENTE(activo);

CREATE TABLE IF NOT EXISTS antecedente_catalogo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO antecedente_catalogo (id, nombre, activo) VALUES
(1, 'Hipertensión', 1),
(2, 'Diabetes', 1),
(3, 'Hipertiroidismo', 1),
(4, 'Hipotiroidismo', 1),
(5, 'Otros', 1);

CREATE TABLE IF NOT EXISTS paciente_antecedente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INTEGER NOT NULL,
    id_antecedente INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('FAMILIAR', 'PATOLOGICO')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id),
    FOREIGN KEY (id_antecedente) REFERENCES antecedente_catalogo(id),

    UNIQUE (id_paciente, id_antecedente, tipo)
);

CREATE INDEX IF NOT EXISTS idx_paciente_ant_paciente 
ON paciente_antecedente(id_paciente);

CREATE TABLE IF NOT EXISTS cie10 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    capitulo TEXT,
    grupo TEXT,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cie10_codigo ON cie10(codigo);
CREATE INDEX IF NOT EXISTS idx_cie10_descripcion ON cie10(descripcion);

CREATE TABLE IF NOT EXISTS consulta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INTEGER NOT NULL,
    motivo_consulta TEXT,
    diagnostico INTEGER,
    medicacion INTEGER DEFAULT 0,
    fecha_atencion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id),
    FOREIGN KEY (diagnostico) REFERENCES cie10(id)
);

CREATE INDEX IF NOT EXISTS idx_consulta_paciente ON consulta(id_paciente);
CREATE INDEX IF NOT EXISTS idx_consulta_activo ON consulta(activo);
CREATE INDEX IF NOT EXISTS idx_consulta_diagnostico ON consulta(diagnostico);

CREATE TABLE IF NOT EXISTS consulta_signos_vitales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_consulta INTEGER NOT NULL UNIQUE,
    peso REAL,
    talla REAL,
    temperatura REAL,
    presion_arterial TEXT,
    frecuencia_cardiaca INTEGER,
    frecuencia_respiratoria INTEGER,
    saturacion_oxigeno INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_consulta) REFERENCES consulta(id)
);

CREATE TABLE IF NOT EXISTS medicamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cantidad TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    UNIQUE (nombre, cantidad)
);

CREATE INDEX IF NOT EXISTS idx_medicamento_nombre ON medicamento(nombre);
CREATE INDEX IF NOT EXISTS idx_medicamento_activo ON medicamento(activo);
CREATE INDEX IF NOT EXISTS idx_medicamento_stock ON medicamento(stock);

CREATE TABLE IF NOT EXISTS receta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_consulta INTEGER NOT NULL,
    id_medicamento INTEGER NOT NULL,
    dosis TEXT NOT NULL,
    frecuencia TEXT,
    duracion TEXT,
    via_administracion TEXT,
    cantidad_entregada INTEGER DEFAULT 0,
    indicaciones TEXT,
    activo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    FOREIGN KEY (id_consulta) REFERENCES consulta(id),
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id)
);

CREATE INDEX IF NOT EXISTS idx_receta_consulta ON receta(id_consulta);
CREATE INDEX IF NOT EXISTS idx_receta_medicamento ON receta(id_medicamento);
CREATE INDEX IF NOT EXISTS idx_receta_activo ON receta(activo);

CREATE TABLE IF NOT EXISTS inventario_movimiento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_medicamento INTEGER NOT NULL,
    id_consulta INTEGER,
    id_receta INTEGER,
    tipo_movimiento TEXT NOT NULL CHECK (
        tipo_movimiento IN ('ENTRADA', 'SALIDA', 'AJUSTE')
    ),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    motivo TEXT,
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id),
    FOREIGN KEY (id_consulta) REFERENCES consulta(id),
    FOREIGN KEY (id_receta) REFERENCES receta(id)
);

CREATE INDEX IF NOT EXISTS idx_inv_mov_medicamento 
ON inventario_movimiento(id_medicamento);

CREATE INDEX IF NOT EXISTS idx_inv_mov_consulta 
ON inventario_movimiento(id_consulta);

CREATE INDEX IF NOT EXISTS idx_inv_mov_receta 
ON inventario_movimiento(id_receta);

CREATE INDEX IF NOT EXISTS idx_inv_mov_fecha 
ON inventario_movimiento(fecha_movimiento);