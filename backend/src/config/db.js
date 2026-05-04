import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  charset: "utf8mb4",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const testConnection = async () => {
  const maxIntentos = 20;
  const tiempoEspera = 3000;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const connection = await pool.getConnection();

      await connection.query("SET NAMES utf8mb4");
      await connection.query("SET CHARACTER SET utf8mb4");

      console.log("Conexión a MySQL correcta");

      connection.release();
      return;
    } catch (error) {
      console.log(
        `MySQL aún no está listo. Intento ${intento}/${maxIntentos}: ${error.message}`
      );

      if (intento === maxIntentos) {
        console.error("No se pudo conectar a MySQL después de varios intentos.");
        process.exit(1);
      }

      await sleep(tiempoEspera);
    }
  }
};