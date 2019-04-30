import { Router, Request, Response } from "express";
import axios from "axios";
import { USER_CAMERA, PASS_CAMERA } from "../../../global/enviroment";
import Server from "../../controllers/server";
import Camaras from "../../controllers/camaras";
const rutas_camara = Router();

const instanciaServidor = Server.instance;
const instanciaCamaras = Camaras.instanciaCamaras;

rutas_camara.get("/prueba", (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ mensaje: "Este es el endpoint de las respectivas camaras" });
});

rutas_camara.get("/sacar_session", (req: Request, res: Response) => {
  let usuario = USER_CAMERA;
  let password = PASS_CAMERA;

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
  /*   let alarma = parsedBody.plain; */

  let alarma = "MDR210FGSA-10004(IO_1 Alarm Start) 2019-04-13 03:48:52";
  let separar_data_alarma = alarma.search("IO_1 Alarm Start");
  let vehiculo_dispositivo = alarma.substring(0, separar_data_alarma - 1);
  let respuesta_veh_dispositivo = vehiculo_dispositivo.split("-");

  let respuesta = {
    dvr: respuesta_veh_dispositivo[0],
    num_dis: respuesta_veh_dispositivo[1],
    activo: true,
    disponible: true
  };
  if (instanciaCamaras.alarmaDuplicada(respuesta)) {
    return res.send({
      mensaje: "la alarma que quieres emitir ya esta duplicada rey "
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

export default rutas_camara;
