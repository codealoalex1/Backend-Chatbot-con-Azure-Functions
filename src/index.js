import { app } from "@azure/functions";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url"; // Necesario para emular __dirname

// 1. Recrear __dirname correctamente para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.setup({
  enableHttpStream: true,
});

const functionsDir = path.join(__dirname, "functions");

if (fs.existsSync(functionsDir)) {
  fs.readdirSync(functionsDir).forEach((file) => {
    if (file.endsWith(".js")) {
      // 2. En Windows, las rutas nativas a veces fallan en import(),
      // es mejor convertirlas a formato URL de archivo (file://)
      const filePath = path.join(functionsDir, file);
      import(`file://${filePath}`);
    }
  });
}
