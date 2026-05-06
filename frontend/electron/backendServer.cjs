const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const BACKEND_PORT = 3000;

async function startBackend(electronApp) {
  const userDataPath = electronApp.getPath("userData");

  const backendRoot = path.join(__dirname, "..", "backend");

  const dbPath = path.join(userDataPath, "serums.db");
  const baseDbPath = path.join(backendRoot, "database", "serums_base.db");
  const schemaPath = path.join(backendRoot, "database", "schema.sqlite.sql");

  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  if (!fs.existsSync(dbPath) && fs.existsSync(baseDbPath)) {
    fs.copyFileSync(baseDbPath, dbPath);
    console.log(`Base inicial copiada desde: ${baseDbPath}`);
    console.log(`Base local creada en: ${dbPath}`);
  }

  process.env.PORT = String(BACKEND_PORT);
  process.env.DB_ENGINE = "sqlite";
  process.env.SQLITE_DB_PATH = dbPath;
  process.env.SQLITE_SCHEMA_PATH = schemaPath;

  const appModule = await import(
    pathToFileURL(path.join(backendRoot, "src", "app.js")).href
  );

  const dbModule = await import(
    pathToFileURL(path.join(backendRoot, "src", "config", "db.js")).href
  );

  await dbModule.testConnection();

  const expressApp = appModule.default;

  return new Promise((resolve, reject) => {
    const server = expressApp.listen(BACKEND_PORT, "127.0.0.1", () => {
      console.log(`Backend local iniciado en http://127.0.0.1:${BACKEND_PORT}`);
      console.log(`Base SQLite local: ${dbPath}`);
      resolve(server);
    });

    server.on("error", (error) => {
      console.error("Error iniciando backend local:", error);
      reject(error);
    });
  });
}

module.exports = {
  startBackend,
};