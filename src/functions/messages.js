import { app as azureApp } from "@azure/functions";
import express from "express";
import cors from "cors";
import "dotenv/config";

// Importamos nuestro adaptador nativo hecho en el Paso 1
import { azureFunctionsExpress } from "../expressAdapter.js";

import { RutasModelo } from "../routes/model.route.js";
import { redisOptions } from "../routes/formulario.route.js";
import { locationRouter } from "../routes/locations.route.js";

const expressApp = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
expressApp.use(cors(corsOptions));
expressApp.use(express.json());

// Tus rutas de Express normales (sin el prefijo /api, ya que Azure lo maneja)
expressApp.get("/bloqueRespuesta", (req, res) => {
  return res.status(200).json({ message: "recibido" });
});

/* Rutas existentes */
expressApp.use("/model", RutasModelo);
expressApp.use("/redis", redisOptions);
expressApp.use("/location", locationRouter);

// Configuramos Azure para escuchar todo y pasárselo a Express
azureApp.http("messages", {
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  authLevel: "anonymous",
  route: "{*any}", // Captura absolutamente todas las sub-rutas
  handler: azureFunctionsExpress(expressApp),
});
