"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camaras_1 = __importDefault(require("../controllers/camaras"));
const camaras_dahua_1 = __importDefault(require("../controllers/camaras_dahua"));
const enviroment_1 = require("../../global/enviroment");
const instanciaCamaras = camaras_1.default.instanciaCamaras;
const instanciaCamarasDahua = camaras_dahua_1.default.instanciaCamarasDahua;
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
/*=============================== SOCKETS DE DAHUA============================ */
exports.alarmaAtendidaDahua = (cliente, io) => {
    cliente.on("alarma_atendida_dahua", (payload) => {
        let camara_ocupada = instanciaCamarasDahua.modificarAlarma(payload);
        let url = `rtsp://${enviroment_1.USER_DAHUA}:${enviroment_1.PASSWORD_DAHUA}#@${payload.ip}:554/cam/realmonitor?channel=1&subtype=1.`;
        let stream = instanciaCamarasDahua.regresaStream(url, payload.num_dis);
        cliente.broadcast.emit("alarma_atendida_dahua", camara_ocupada);
        var pipeStream = function (data) {
            cliente.emit(`data_${payload.num_dis}`, data);
        };
        stream.on("data", pipeStream);
        instanciaCamarasDahua.agregarStreamArreglo(stream, payload.num_dis, pipeStream);
    });
};
//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
exports.limpiarAlarmasDahua = (cliente, io) => {
    cliente.on("limpiar_alarmas_dahua", (payload) => {
        let respuestaAlarmas = instanciaCamarasDahua.limpiarAlarmas(payload);
        cliente.broadcast.emit("limpiar_alarmas_dahua", respuestaAlarmas);
    });
};
exports.cerrarAlarmadDahua = (cliente, io) => {
    let num_dis = "";
    cliente.on("cerraralarma-definitiva-dahua", (payload) => {
        console.log("cerrando");
        instanciaCamarasDahua.eliminarAlarma(payload);
        num_dis = payload;
        console.log("el cliente es" + cliente.id);
        cliente.broadcast.emit("cerraralarma-definitiva-dahua", num_dis);
    });
};
/* cerraralarma-definitiva-dahua
 */
