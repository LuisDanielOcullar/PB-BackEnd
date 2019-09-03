import { Router, Request, Response } from "express";
import Server from "../../controllers/server";
import Camaras from "../../controllers/camaras";
import { USER_DAHUA, PASSWORD_DAHUA } from "../../../global/enviroment";
import CamarasDahua from "../../controllers/camaras_dahua";
const rutas_camara = Router();
var rtsp = require("rtsp-ffmpeg");

const instanciaServidor = Server.instance;
const instanciaCamarasDahua = CamarasDahua.instanciaCamarasDahua;

rutas_camara.get("/regresaStreamActivos", (req: Request, res: Response) => {
  return res.send(instanciaCamarasDahua.regresaTodosStreamActivos());
});

rutas_camara.post("/dahuaCorreo", (req: Request, res: Response) => {
  let parsedBody = req.body;

  let alarma = parsedBody.plain;

  //aqui estamos enviando el nombre del dispositivo
  let num_dis = parsedBody.headers["Subject"];
  //esta linea lo que hacemos es separar los \n\r.
  let alarma_corregida = alarma.replace(/\r\n/g, "_").replace(/[\r\n]/g, "_");

  let alarma_separada = alarma_corregida.split("_");

  //posiciones del arreglo que ocupamos
  /*  posicion 2 viene la hora y la fecha 
      posicion 5 viene lo que es la ip del dispositivo
  */

  /* =================HORA Y FECHA ========================= */
  let hora_fecha_sf = alarma_separada[2];

  let posicion_fin_parentesis = 0;
  for (let i = 0; i < hora_fecha_sf.length; i++) {
    if (hora_fecha_sf[i] === ")") {
      posicion_fin_parentesis = i;
      break;
    }
  }

  let hora_fecha_sf_conespacios = alarma_separada[2].substring(
    posicion_fin_parentesis + 2,
    alarma_separada[2].length
  );

  let diahoracf = hora_fecha_sf_conespacios.replace(/\s/g, "");

  let dia = diahoracf.substring(0, 10);

  let hora = diahoracf.substring(10, 18);

  /*======================== SACAR IP ============================*/
  let ip_sf = alarma_separada[5];
  let ip_sf_posicion = ip_sf.search("Address");

  let ip = ip_sf.substring(ip_sf_posicion + 9, ip_sf.length);

  let respuesta = {
    num_dis,
    ip,
    activo: true,
    disponible: true,
    dia,
    hora
  };

  if (instanciaCamarasDahua.alarmaDuplicada(respuesta)) {
    return res.send({
      mensaje: "la alarma que quieres emitir ya esta duplicada rey",
      respuesta
    });
  } else {
    instanciaCamarasDahua.agregarAlarma(respuesta);
    console.log("agregada");
    console.log(instanciaCamarasDahua.getAlarmas());

    instanciaServidor.io.emit("alarma-dispositivo-dahua", respuesta);

    return res.send({
      respuesta
    });
  }

  let url = `rtsp://${USER_DAHUA}:${PASSWORD_DAHUA}#@${ip}:554/cam/realmonitor?channel=1&subtype=1.`;

  /* 
  var pipeStream = function(data: any) {
    instanciaServidor.io.emit("datajuanin", data);
  };
  cams[0].on("data", pipeStream);
  setTimeout(() => {
    cams[0].removeListener("data", pipeStream);
    console.log("video se armo como dios");
  }, 20000); */

  return res.send({ mensaje: "fin" });
});

rutas_camara.get("/alarmasActivasDahua", (req: Request, res: Response) => {
  return res.send({ alarmas: instanciaCamarasDahua.getAlarmas() });
});

rutas_camara.get("/datatemp", (req: Request, res: Response) => {
  return res.send({ alarmas: instanciaCamarasDahua.regresardatatemp() });
});
export default rutas_camara;
