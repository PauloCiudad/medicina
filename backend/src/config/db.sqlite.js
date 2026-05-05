import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const resolveSqlitePath = () => {
  const dbPath = process.env.SQLITE_DB_PATH || "./database/serums_dev.db";

  if (path.isAbsolute(dbPath)) {
    return dbPath;
  }

  return path.resolve(process.cwd(), dbPath);
};

const dbPath = resolveSqlitePath();
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.function("CONCAT_WS", { varargs: true }, (separator, ...values) => {
  return values
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join(separator);
});

const schemaPath = process.env.SQLITE_SCHEMA_PATH
  ? path.resolve(process.env.SQLITE_SCHEMA_PATH)
  : path.resolve(process.cwd(), "database", "schema.sqlite.sql");

if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);
} else {
  console.warn("No se encontró schema.sqlite.sql");
}

const normalizeSql = (sql) => {
  return sql.replace(/\s+FOR UPDATE/gi, "");
};

const isSelectQuery = (sql) => {
  const cleanSql = sql.trim().toUpperCase();

  return (
    cleanSql.startsWith("SELECT") ||
    cleanSql.startsWith("WITH") ||
    cleanSql.startsWith("PRAGMA")
  );
};

const executeQuery = (sql, params = []) => {
  const normalizedSql = normalizeSql(sql);
  const statement = db.prepare(normalizedSql);

  if (isSelectQuery(normalizedSql)) {
    const rows = statement.all(params);
    return [rows];
  }

  const result = statement.run(params);

  return [
    {
      insertId: Number(result.lastInsertRowid || 0),
      affectedRows: result.changes,
      changes: result.changes,
    },
  ];
};

export const pool = {
  query: async (sql, params = []) => {
    return executeQuery(sql, params);
  },

  getConnection: async () => {
    let transactionStarted = false;

    return {
      query: async (sql, params = []) => {
        return executeQuery(sql, params);
      },

      beginTransaction: async () => {
        if (!transactionStarted) {
          db.exec("BEGIN IMMEDIATE");
          transactionStarted = true;
        }
      },

      commit: async () => {
        if (transactionStarted) {
          db.exec("COMMIT");
          transactionStarted = false;
        }
      },

      rollback: async () => {
        if (transactionStarted) {
          db.exec("ROLLBACK");
          transactionStarted = false;
        }
      },

      release: () => {},
    };
  },
};

export const testConnection = async () => {
  try {
    db.prepare("SELECT 1 AS ok").get();
    console.log(`Conexión SQLite correcta: ${dbPath}`);
  } catch (error) {
    console.error("Error conectando a SQLite:", error.message);
    process.exit(1);
  }
};