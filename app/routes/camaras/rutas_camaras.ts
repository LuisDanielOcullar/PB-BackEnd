import { Router, Request, Response } from "express";
import axios from "axios";
import Server from "../../controllers/server";
import Camaras from "../../controllers/camaras";
const rutas_camara = Router();
var rtsp = require("rtsp-ffmpeg");

const instanciaServidor = Server.instance;
const instanciaCamaras = Camaras.instanciaCamaras;

rutas_camara.get("/prueba", (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ mensaje: "Este es el endpoint de las respectivas camaras" });
});

rutas_camara.get("/sacar_session", (req: Request, res: Response) => {
  let usuario = process.env.USER_CAMERA;
  console.log(process.env.USER_CAMERA);
  let password = process.env.PASS_CAMERA;

  axios
    .get(
      `http://18.217.222.220:8080/StandardApiAction_login.action?account=${usuario}&password=${password}`
    )
    .then((respuesta: any) => {
      let login_correcto = respuesta.data;
      return res
        .status(200)
        .send({ respuesta: login_correcto, jsession: login_correcto.jsession });
    });
});

rutas_camara.post("/data_correo", (req: Request, res: Response) => {
  let parsedBody = req.body;

  /* console.log("parsedBody.plain", parsedBody.plain); */
  /*  console.log("parsedBody.from", parsedBody.from);
  console.log('parsedBody.headers["Subject"]', parsedBody.headers["Subject"]); */
  /*   console.log("parseBody.html", parsedBody.html);
  console.log("parseBody", parsedBody); 
 */
  let alarma = parsedBody.plain;

  /* let alarma = "MDR210FGSA-10004(IO_1 Alarm Start) 2019-04-13 03:48:52"; */

  /* let alarma =
    "   10002-10002(Emergency Button Alarm Start)  2019-05-22 11:07:50   "; */
  let separar_data_alarma = alarma.search("IO_1 Alarm Start");

  if (separar_data_alarma < 1) {
    separar_data_alarma = alarma.search("Emergency Button Alarm Start");
  }

  let vehiculo_dispositivo = alarma.substring(0, separar_data_alarma - 1);
  let alarma_temp = alarma.substring(
    vehiculo_dispositivo.length,
    alarma.length
  );

  let posicion_fin_parentesis = 0;
  for (let i = 0; i < alarma_temp.length; i++) {
    if (alarma_temp[i] === ")") {
      posicion_fin_parentesis = i;
      break;
    }
  }

  //encuentra la hora y dia

  let diahora = alarma_temp.substring(posicion_fin_parentesis + 1);
  let diahoraformato = diahora.replace(/\s/g, "");

  let dia = diahoraformato.substring(0, 10);

  let hora = diahoraformato.substring(10, 18);

  let respuesta_veh_dispositivo = vehiculo_dispositivo.split("-");

  let respuesta = {
    dvr: respuesta_veh_dispositivo[0],
    num_dis: respuesta_veh_dispositivo[1],
    activo: true,
    disponible: true,
    dia,
    hora
  };

  if (instanciaCamaras.alarmaDuplicada(respuesta)) {
    return res.send({
      mensaje: "la alarma que quieres emitir ya esta duplicada rey",
      respuesta
    });
  } else {
    instanciaCamaras.agregarAlarma(respuesta);
    console.log("agregada");
    console.log(instanciaCamaras.getAlarmas());

    instanciaServidor.io.emit("alarma-dispositivo", respuesta);

    return res.send({
      respuesta
    });
  }
});

rutas_camara.get("/alarmasActivas", (req: Request, res: Response) => {
  return res.send({ alarmas: instanciaCamaras.getAlarmas() });
});

rutas_camara.get("/pruebadedahua", (req: Request, res: Response) => {
  /*  'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov', */
  var cams = [
   /*  "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov" */
   "rtsp://admin:0cu11qr#@192.168.0.108:554/cam/realmonitor?channel=1&subtype=1."
  ].map(function(uri, i) {
    var stream = new rtsp.FFMpeg({
      input: uri,
      resolution: "320x240",
      quality: 3
    });
    stream.on("start", function() {
      console.log("stream " + i + " started");
    });
    stream.on("stop", function() {
      console.log("stream " + i + " stopped");
    });
    return stream;
  });
  console.log(cams);

  var pipeStream = function(data: any) {
    instanciaServidor.io.emit("datajuanin", data);
  };
  cams[0].on("data", pipeStream);
  setTimeout(() => {
    cams[0].removeListener("data", pipeStream);
    console.log("video se armo como dios");
  }, 20000);

  
  return res.send({ mensaje: "fin" });
});

export default rutas_camara;
