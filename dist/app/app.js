"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./controllers/server"));
var rutas = require("./routes/index");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
class App {
    constructor() {
        this.server = server_1.default.instance;
        this.configuracionBodyParser();
        this.configurarCors();
        this.configuRarRutas();
    }
    configuracionBodyParser() {
        this.server.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.server.app.use(body_parser_1.default.json());
    }
    configurarCors() {
        //vamos a configurar cors aunque no esten en el mismo dominio
        this.server.app.use(cors_1.default({ origin: true, credentials: true }));
    }
    configuRarRutas() {
        this.server.app.use("/api/v1", rutas.rutas_camaras); //aqui esta las de richmond y el de jsession
        this.server.app.use("", rutas.rutas_algo);
    }
}
exports.App = App;
