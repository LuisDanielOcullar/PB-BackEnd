import Server from "./app/controllers/server";

import { App } from "./app/app";
import * as dotenv from "dotenv";

const server = Server.instance;

dotenv.config();

const app = new App();

dotenv.config();
server.start(() => {
  console.log(`Servidor levantado en  puerto ${process.env.SERVER_PORT}`);
});
