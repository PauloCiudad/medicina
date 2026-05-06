const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..", "..");
const sourceBackend = path.join(rootDir, "backend");
const targetBackend = path.join(rootDir, "frontend", "backend");

const copyDir = (source, target) => {
  fs.cpSync(source, target, {
    recursive: true,
    force: true,
  });
};

console.log("Copiando backend para empaquetado...");

fs.rmSync(targetBackend, {
  recursive: true,
  force: true,
});

fs.mkdirSync(targetBackend, {
  recursive: true,
});

copyDir(path.join(sourceBackend, "src"), path.join(targetBackend, "src"));

fs.mkdirSync(path.join(targetBackend, "database"), {
  recursive: true,
});

fs.copyFileSync(
  path.join(sourceBackend, "database", "schema.sqlite.sql"),
  path.join(targetBackend, "database", "schema.sqlite.sql")
);

const baseDbSource = path.join(sourceBackend, "database", "serums_base.db");
const baseDbTarget = path.join(targetBackend, "database", "serums_base.db");

if (fs.existsSync(baseDbSource)) {
  fs.copyFileSync(baseDbSource, baseDbTarget);
  console.log("serums_base.db copiado correctamente.");
} else {
  console.warn("No se encontró serums_base.db. La app iniciará con base vacía.");
}

console.log("Backend copiado correctamente en frontend/backend");