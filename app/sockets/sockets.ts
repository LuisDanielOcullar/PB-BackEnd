import { Socket } from "socket.io";
import socketIO from "socket.io";
import Camaras from "../controllers/camaras";
import CamarasDahua from "../controllers/camaras_dahua";
import { USER_DAHUA, PASSWORD_DAHUA } from "../../global/enviroment";

const instanciaCamaras = Camaras.instanciaCamaras;
const instanciaCamarasDahua = CamarasDahua.instanciaCamarasDahua;

//aqui estamos configurando el cliente por default
export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
  console.log("----------------------");
};

export const cerrarAlarma = (cliente: Socket, io: socketIO.Server) => {
  let num_dis = "";
  cliente.on("cerraralarma-definitiva", (payload: any) => {
    console.log("cerrando");

    instanciaCamaras.eliminarAlarma(payload);
    num_dis = payload;

    console.log("el cliente es" + cliente.id);
    cliente.broadcast.emit("cerraralarma-definitiva", num_dis);
  });
};

//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
export const alarmaAtendida = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("alarma_atendida", (payload: any) => {
    let camara_ocupada = instanciaCamaras.modificarAlarma(payload);

    cliente.broadcast.emit("alarma_atendida", camara_ocupada);
  });
};

//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
export const limpiarAlarmas = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("limpiar_alarmas", (payload: any) => {
    let respuestaAlarmas = instanciaCamaras.limpiarAlarmas(payload);
    console.log("estoy limpiando alarmillas");
    cliente.broadcast.emit("limpiar_alarmas", respuestaAlarmas);
  });
};
/*=============================== SOCKETS DE DAHUA============================ */
export const alarmaAtendidaDahua = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("alarma_atendida_dahua", (payload: any) => {
    let camara_ocupada = instanciaCamarasDahua.modificarAlarma(payload);

    let url = `rtsp://${USER_DAHUA}:${PASSWORD_DAHUA}#@${
      payload.ip
    }:554/cam/realmonitor?channel=1&subtype=1.`;

    let stream = instanciaCamarasDahua.regresaStream(url, payload.num_dis);
    cliente.broadcast.emit("alarma_atendida_dahua", camara_ocupada);

    var pipeStream = function(data: any) {
      cliente.emit(`data_${payload.num_dis}`, data);
    };
    stream.on("data", pipeStream);

    instanciaCamarasDahua.agregarStreamArreglo(
      stream,
      payload.num_dis,
      pipeStream
    );
  });
};

//este metodo nos permite notificar a los otros cuando una alarma se esta atendiendo
export const limpiarAlarmasDahua = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("limpiar_alarmas_dahua", (payload: any) => {
    let respuestaAlarmas = instanciaCamarasDahua.limpiarAlarmas(payload);

    cliente.broadcast.emit("limpiar_alarmas_dahua", respuestaAlarmas);
  });
};

export const cerrarAlarmadDahua = (cliente: Socket, io: socketIO.Server) => {
  let num_dis = "";
  cliente.on("cerraralarma-definitiva-dahua", (payload: any) => {
    console.log("cerrando");

    instanciaCamarasDahua.eliminarAlarma(payload);
    num_dis = payload;

    console.log("el cliente es" + cliente.id);
    cliente.broadcast.emit("cerraralarma-definitiva-dahua", num_dis);
  });
};

/* cerraralarma-definitiva-dahua
 */

