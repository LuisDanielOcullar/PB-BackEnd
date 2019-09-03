import Server from "./controllers/server";
var rutas = require("./routes/index");
import bodyParser from "body-parser";
import cors from "cors";
export class App {
  private server: Server;
  constructor() {
    this.server = Server.instance;
    this.configuracionBodyParser();
    this.configurarCors();
    this.configuRarRutas();
  }

  configuracionBodyParser() {
    this.server.app.use(bodyParser.urlencoded({ extended: true }));
    this.server.app.use(bodyParser.json());
  }
  configurarCors() {
    //vamos a configurar cors aunque no esten en el mismo dominio
    this.server.app.use(cors({ origin: true, credentials: true }));
  }

  configuRarRutas() {
    this.server.app.use("/api/v1", rutas.rutas_camaras); //aqui esta las de richmond y el de jsession
    this.server.app.use("/api/v1/dahua", rutas.rutas_dahua); //aqui esta las de richmond y el de jsession
    this.server.app.use("", rutas.rutas_algo);
  }     
}
