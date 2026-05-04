const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  ping: () => "Electron conectado correctamente",
});