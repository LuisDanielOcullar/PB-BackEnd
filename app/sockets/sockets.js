"use strict";
exports.__esModule = true;
var camaras_1 = require("../controllers/camaras");
var instanciaCamaras = camaras_1["default"].instanciaCamaras;
//aqui estamos configurando el cliente por default
exports.conectarCliente = function (cliente, io) {
    console.log("----------------------");
};
exports.cerrarAlarma = function (cliente, io) {
    var num_dis = "";
    cliente.on("cerraralarma-definitiva", function (payload) {
        console.log("cerrando");
        instanciaCamaras.eliminarAlarma(payload);
        num_dis = payload;
        console.log("el cliente es" + cliente.id);
        cliente.broadcast.emit("cerraralarma-definitiva", num_dis);
    });
};
//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
exports.alarmaAtendida = function (cliente, io) {
    cliente.on("alarma_atendida", function (payload) {
        var camara_ocupada = instanciaCamaras.modificarAlarma(payload);
        cliente.broadcast.emit("alarma_atendida", camara_ocupada);
    });
};
//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
exports.limpiarAlarmas = function (cliente, io) {
    cliente.on("limpiar_alarmas", function (payload) {
        var respuestaAlarmas = instanciaCamaras.limpiarAlarmas(payload);
        console.log("estoy limpiando alarmillas");
        cliente.broadcast.emit("limpiar_alarmas", respuestaAlarmas);
    });
};
