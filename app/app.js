"use strict";
exports.__esModule = true;
var server_1 = require("./controllers/server");
var rutas = require("./routes/index");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var App = /** @class */ (function () {
    function App() {
        this.server = server_1["default"].instance;
        this.configuracionBodyParser();
        this.configurarCors();
        this.configuRarRutas();
    }
    App.prototype.configuracionBodyParser = function () {
        this.server.app.use(body_parser_1["default"].urlencoded({ extended: true }));
        this.server.app.use(body_parser_1["default"].json());
    };
    App.prototype.configurarCors = function () {
        //vamos a configurar cors aunque no esten en el mismo dominio
        this.server.app.use(cors_1["default"]({ origin: true, credentials: true }));
    };
    App.prototype.configuRarRutas = function () {
        this.server.app.use("/api/v1", rutas.rutas_camaras); //aqui esta las de richmond y el de jsession
        this.server.app.use("", rutas.rutas_algo);
    };
    return App;
}());
exports.App = App;
