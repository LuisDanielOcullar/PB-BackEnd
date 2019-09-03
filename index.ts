
import Server from "./app/controllers/server";

import { App } from "./app/app";
import * as dotenv from "dotenv";

const server = Server.instance;

dotenv.config();

const app = new App();

dotenv.config();
//inicia servidor
//toma 0 argumentos y regresa un console.log
server.start(() => {
  console.log(`Servidor levantado en  puerto ${server.port}`);
});
