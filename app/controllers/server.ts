import express from "express";

import http from "http";
import SocketIO from "socket.io";

//se importan los sockets creados en el directorio especificado
import * as socket from "../sockets/sockets";

//recuerda instalar types/express

//Exporta la clase unica del archivo "Server"
export default class Server {
  //Declara la variable estatica _instance de tipo server
  private static _instance: Server;
  //Declara la variable app tipo Application
  public app: express.Application;
  //declara variable del puerto
  public port: number;

  public io: SocketIO.Server; //es la configuracion de los sockets
  private httpServer: http.Server;

  //constructor del servidor
  private constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000; //funciona con el puerto 5000

    this.httpServer = new http.Server(this.app);

    this.io = SocketIO(this.httpServer); //tenemos que poner este mismo configurado
    this.escucharSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new Server());
  }

  //escucha las peticiones del front y manda a llamar las funciones
  private escucharSockets() {
    console.log("escuchando conexiones");
    //el on es para escuchar eventos
    this.io.on("connection", cliente => {
      socket.conectarCliente(cliente, this.io);
      //marca a la camara como no diponible ni activa para usarse
      socket.alarmaAtendida(cliente, this.io);

      socket.limpiarAlarmas(cliente, this.io);
      //este es para quitar ese dispositivo del array
      socket.cerrarAlarma(cliente, this.io);

      /* sockets dahua */
      socket.alarmaAtendidaDahua(cliente, this.io);
      socket.limpiarAlarmasDahua(cliente, this.io);
      socket.cerrarAlarmadDahua(cliente, this.io); 
    });
  }
  start(callback: any) {
    return this.httpServer.listen(this.port, callback);
  }
}
