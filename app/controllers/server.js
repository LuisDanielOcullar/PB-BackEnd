"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var socket = require("../sockets/sockets");
//recuerda instalar types/express
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1["default"]();
        this.port = Number(process.env.PORT) || 5000;
        this.httpServer = new http_1["default"].Server(this.app);
        this.io = socket_io_1["default"](this.httpServer); //tenemos que poner este mismo configurado
        this.escucharSockets();
    }
    Object.defineProperty(Server, "instance", {
        get: function () {
            return this._instance || (this._instance = new Server());
        },
        enumerable: true,
        configurable: true
    });
    Server.prototype.escucharSockets = function () {
        var _this = this;
        console.log("escuchando conexiones");
        //el on es para escuchar eventos
        this.io.on("connection", function (cliente) {
            socket.conectarCliente(cliente, _this.io);
            //este es para quitar ese dispositivo del array
            socket.cerrarAlarma(cliente, _this.io);
            //desconectar
            socket.alarmaAtendida(cliente, _this.io);
            socket.limpiarAlarmas(cliente, _this.io);
        });
    };
    Server.prototype.start = function (callback) {
        return this.httpServer.listen(this.port, callback);
    };
    return Server;
}());
exports["default"] = Server;
