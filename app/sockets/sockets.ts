import { Socket } from "socket.io";
import socketIO from "socket.io";
import Camaras from "../controllers/camaras";

const instanciaCamaras = Camaras.instanciaCamaras;

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
