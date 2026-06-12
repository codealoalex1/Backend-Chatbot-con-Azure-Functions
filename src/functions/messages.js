import { app } from "@azure/functions";
import express from "express";
import cors from "cors";
import "dotenv/config";

import { RutasModelo } from "../routes/model.route.js";
import { redisOptions } from "../routes/formulario.route.js";
import { locationRouter } from "../routes/locations.route.js";

app.http("messages", {
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const app = express();
    const corsOptions = {
      origin: "*",
      optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));
    app.use(express.json());

      const PORT = process.env.PORT;
      
      app.get("/bloqueRespuesta", (req, res) => {
          return res.status(200).json({
            message:"recibido"
        })  
      })

    /* Routes */
    app.use("/api/model", RutasModelo);
    app.use("/api/redis", redisOptions);
      app.use("/api/location", locationRouter);


    app.listen(PORT, () => {
      console.log("Escuchando en el puerto:", PORT);
    });
  },
});
