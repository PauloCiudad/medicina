import dotenv from "dotenv";

dotenv.config();

const engine = process.env.DB_ENGINE || "sqlite";

let dbModule;

if (engine === "sqlite") {
  dbModule = await import("./db.sqlite.js");
} else {
  dbModule = await import("./db.mysql.js");
}

export const pool = dbModule.pool;
export const testConnection = dbModule.testConnection;