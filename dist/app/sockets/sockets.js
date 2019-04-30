"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camaras_1 = __importDefault(require("../controllers/camaras"));
const instanciaCamaras = camaras_1.default.instanciaCamaras;
//aqui estamos configurando el cliente por default
exports.conectarCliente = (cliente, io) => {
    console.log("----------------------");
};
exports.cerrarAlarma = (cliente, io) => {
    let num_dis = "";
    cliente.on("cerraralarma-definitiva", (payload) => {
        console.log("cerrando");
        instanciaCamaras.eliminarAlarma(payload);
        num_dis = payload;
        console.log("el cliente es" + cliente.id);
        cliente.broadcast.emit("cerraralarma-definitiva", num_dis);
    });
};
//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
exports.alarmaAtendida = (cliente, io) => {
    cliente.on("alarma_atendida", (payload) => {
        let camara_ocupada = instanciaCamaras.modificarAlarma(payload);
        cliente.broadcast.emit("alarma_atendida", camara_ocupada);
    });
};
//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
exports.limpiarAlarmas = (cliente, io) => {
    cliente.on("limpiar_alarmas", (payload) => {
        let respuestaAlarmas = instanciaCamaras.limpiarAlarmas(payload);
        console.log("estoy limpiando alarmillas");
        cliente.broadcast.emit("limpiar_alarmas", respuestaAlarmas);
    });
};
