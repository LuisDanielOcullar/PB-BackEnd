import Server from "./app/controllers/server";
import { SERVER_PORT } from "./global/enviroment";
import { App } from "./app/app";

const server = Server.instance;

const app = new App();

server.start(() => {
  console.log(`Servidor levantado en  puerto ${SERVER_PORT}`);
});
