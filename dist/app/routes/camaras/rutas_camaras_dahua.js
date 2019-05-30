"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../../controllers/server"));
const enviroment_1 = require("../../../global/enviroment");
const camaras_dahua_1 = __importDefault(require("../../controllers/camaras_dahua"));
const rutas_camara = express_1.Router();
var rtsp = require("rtsp-ffmpeg");
const instanciaServidor = server_1.default.instance;
const instanciaCamarasDahua = camaras_dahua_1.default.instanciaCamarasDahua;
rutas_camara.get("/regresaStreamActivos", (req, res) => {
    return res.send(instanciaCamarasDahua.regresaTodosStreamActivos());
});
rutas_camara.post("/dahuaCorreo", (req, res) => {
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
    let hora_fecha_sf_conespacios = alarma_separada[2].substring(posicion_fin_parentesis + 2, alarma_separada[2].length);
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
    }
    else {
        instanciaCamarasDahua.agregarAlarma(respuesta);
        console.log("agregada");
        console.log(instanciaCamarasDahua.getAlarmas());
        instanciaServidor.io.emit("alarma-dispositivo-dahua", respuesta);
        return res.send({
            respuesta
        });
    }
    let url = `rtsp://${enviroment_1.USER_DAHUA}:${enviroment_1.PASSWORD_DAHUA}#@${ip}:554/cam/realmonitor?channel=1&subtype=1.`;
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
rutas_camara.get("/alarmasActivasDahua", (req, res) => {
    return res.send({ alarmas: instanciaCamarasDahua.getAlarmas() });
});
rutas_camara.get("/datatemp", (req, res) => {
    return res.send({ alarmas: instanciaCamarasDahua.regresardatatemp() });
});
exports.default = rutas_camara;
