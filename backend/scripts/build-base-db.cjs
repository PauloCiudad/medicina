const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const databaseDir = path.resolve(__dirname, "..", "database");

const schemaPath = path.join(databaseDir, "schema.sqlite.sql");
const cie10CsvPath = path.join(databaseDir, "cie10_minsa_limpio.csv");
const baseDbPath = path.join(databaseDir, "serums_base.db");

function normalizeHeader(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);

  return result.map((value) => value.trim());
}

function parseCsv(content) {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);

  const indexCodigo = headers.indexOf("codigo");
  const indexDescripcion = headers.indexOf("descripcion");
  const indexCapitulo = headers.indexOf("capitulo");
  const indexGrupo = headers.indexOf("grupo");

  if (indexCodigo === -1 || indexDescripcion === -1) {
    throw new Error(
      "El CSV debe tener como mínimo las columnas codigo y descripcion"
    );
  }

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);

    return {
      codigo: values[indexCodigo] || "",
      descripcion: values[indexDescripcion] || "",
      capitulo: indexCapitulo >= 0 ? values[indexCapitulo] || null : null,
      grupo: indexGrupo >= 0 ? values[indexGrupo] || null : null,
    };
  });
}

console.log("Generando base SQLite base...");

if (!fs.existsSync(schemaPath)) {
  throw new Error(`No se encontró el schema: ${schemaPath}`);
}

if (!fs.existsSync(cie10CsvPath)) {
  throw new Error(`No se encontró el CSV CIE10: ${cie10CsvPath}`);
}

if (fs.existsSync(baseDbPath)) {
  fs.unlinkSync(baseDbPath);
}

const db = new Database(baseDbPath);

db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

console.log("Tablas creadas correctamente.");

const csvContent = fs.readFileSync(cie10CsvPath, "utf8");
const cie10Rows = parseCsv(csvContent);

console.log(`Registros CIE10 leídos: ${cie10Rows.length}`);

const insertCie10 = db.prepare(`
  INSERT OR IGNORE INTO cie10 (
    codigo,
    descripcion,
    capitulo,
    grupo,
    activo
  ) VALUES (?, ?, ?, ?, 1)
`);

const insertTransaction = db.transaction((rows) => {
  for (const row of rows) {
    if (!row.codigo || !row.descripcion) {
      continue;
    }

    insertCie10.run(
      row.codigo,
      row.descripcion,
      row.capitulo,
      row.grupo
    );
  }
});

insertTransaction(cie10Rows);

const totalCie10 = db.prepare("SELECT COUNT(*) AS total FROM cie10").get();

console.log(`CIE10 cargado correctamente. Total: ${totalCie10.total}`);
console.log(`Base generada en: ${baseDbPath}`);

db.close();