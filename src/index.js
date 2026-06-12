import { app } from "@azure/functions";
import fs from "node:fs";
import path from "node:path";

app.setup({
    enableHttpStream: true,
});

const functionsDir = path.join(__dirname, "functions");

if (fs.existsSync(functionsDir)) {
    fs.readdirSync(functionsDir).forEach((file) => {
        if (file.endsWith(".js")) {
            import(path.join(functionsDir, file));
        }
    })
}
