"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../../controllers/server"));
const camaras_1 = __importDefault(require("../../controllers/camaras"));
const enviroment_1 = require("../../../global/enviroment");
const rutas_camara = express_1.Router();
var rtsp = require("rtsp-ffmpeg");
const instanciaServidor = server_1.default.instance;
const instanciaCamaras = camaras_1.default.instanciaCamaras;
rutas_camara.get("/dahuaCorreo", (req, res) => {
    let ip = "192.168.0.108";
    let num_dis = "1M0150DPAQ00505";
    let dia = "23/05/2019";
    let hora = "16:28:48";
    let respuesta = {
        num_dis,
        ip,
        activo: true,
        disponible: true,
        dia,
        hora
    };
    let url = `rtsp://${enviroment_1.USER_DAHUA}:${enviroment_1.PASSWORD_DAHUA}#@${ip}:554/cam/realmonitor?channel=1&subtype=1.`;
    let stream = regresaStream(url, num_dis);
    /*
    var pipeStream = function(data: any) {
      instanciaServidor.io.emit("datajuanin", data);
    };
    cams[0].on("data", pipeStream);
    setTimeout(() => {
      cams[0].removeListener("data", pipeStream);
      console.log("video se armo como dios");
    }, 20000); */
    return res.send({ mensaje: "fin", stream });
});
exports.default = rutas_camara;
const regresaStream = (uri, dispositivo) => {
    var stream = new rtsp.FFMpeg({
        input: uri,
        resolution: "320x240",
        quality: 3
    });
    stream.on("start", function () {
        console.log("Transmisión del dispositivo" + dispositivo + " iniciada");
    });
    stream.on("stop", function () {
        console.log("Transmisión del dispositivo" + dispositivo + "detenida");
    });
    return stream;
};
