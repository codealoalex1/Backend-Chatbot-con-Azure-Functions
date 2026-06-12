import { app as azureApp } from "@azure/functions";
import express from "express";
import cors from "cors";
import "dotenv/config";

// Importamos tus rutas existentes
import { RutasModelo } from "./routes/model.route.js";
import { redisOptions } from "./routes/formulario.route.js";
import { locationRouter } from "./routes/locations.route.js";

// Inicializamos Express
const expressApp = express();

expressApp.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
expressApp.use(express.json());

// Endpoint de prueba rápido
expressApp.get("/bloqueRespuesta", (req, res) => {
  return res.status(200).json({ message: "recibido" });
});

// Tus rutas (recuerda que Azure les pondrá el prefijo /api automáticamente)
expressApp.use("/model", RutasModelo);
expressApp.use("/redis", redisOptions);
expressApp.use("/location", locationRouter);

// Aplicamos la configuración global de Azure
azureApp.setup({
  enableHttpStream: true,
});

// Registramos la única función de Azure que manejará TODO Express
azureApp.http("messages", {
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  authLevel: "anonymous",
  route: "{*any}", // Captura cualquier sub-ruta (/api/model, /api/bloqueRespuesta, etc.)
  handler: azureFunctionsExpress(expressApp),
});

// --- EL ADAPTADOR NATIVO (Pegado aquí abajo para no complicar con más archivos) ---
function azureFunctionsExpress(expressApp) {
  return async (request, context) => {
    return new Promise((resolve, reject) => {
      const url = new URL(request.url);
      const pathWithQuery = url.pathname + url.search;

      const reqMock = {
        method: request.method,
        url: pathWithQuery,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.body ? request.json().catch(() => ({})) : {},
        query: Object.fromEntries(url.searchParams.entries()),
      };

      let statusCode = 200;
      let responseHeaders = {};
      let responseBody = undefined;

      const resMock = {
        status: (code) => {
          statusCode = code;
          return resMock;
        },
        setHeader: (name, value) => {
          responseHeaders[name.toLowerCase()] = value;
          return resMock;
        },
        getHeader: (name) => responseHeaders[name.toLowerCase()],
        json: (data) => {
          responseHeaders["content-type"] = "application/json";
          resolve({
            status: statusCode,
            headers: responseHeaders,
            body: JSON.stringify(data),
          });
        },
        send: (data) => {
          if (typeof data === "object") {
            responseHeaders["content-type"] = "application/json";
            responseBody = JSON.stringify(data);
          } else {
            responseHeaders["content-type"] =
              responseHeaders["content-type"] || "text/html";
            responseBody = data;
          }
          resolve({
            status: statusCode,
            headers: responseHeaders,
            body: responseBody,
          });
        },
        end: () => {
          resolve({
            status: statusCode,
            headers: responseHeaders,
            body: responseBody,
          });
        },
      };

      // Resolver promesas de body si vienen diferidas en la v4 de Azure
      Promise.resolve(reqMock.body).then((resolvedBody) => {
        reqMock.body = resolvedBody;
        expressApp(reqMock, resMock, (err) => {
          if (err) reject(err);
          else resolve({ status: 404, body: "Not Found por Express" });
        });
      });
    });
  };
}
