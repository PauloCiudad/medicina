import dotenv from "dotenv";
import app from "./app.js";
import { testConnection } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Servidor SERUMS corriendo en puerto ${PORT}`);
  });
};

startServer();