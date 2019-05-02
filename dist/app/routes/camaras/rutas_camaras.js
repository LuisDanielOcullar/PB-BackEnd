"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const enviroment_1 = require("../../../global/enviroment");
const server_1 = __importDefault(require("../../controllers/server"));
const camaras_1 = __importDefault(require("../../controllers/camaras"));
const rutas_camara = express_1.Router();
const instanciaServidor = server_1.default.instance;
const instanciaCamaras = camaras_1.default.instanciaCamaras;
rutas_camara.get("/prueba", (req, res) => {
    return res
        .status(200)
        .send({ mensaje: "Este es el endpoint de las respectivas camaras" });
});
rutas_camara.get("/sacar_session", (req, res) => {
    let usuario = enviroment_1.USER_CAMERA;
    let password = enviroment_1.PASS_CAMERA;
    axios_1.default
        .get(`http://18.217.222.220:8080/StandardApiAction_login.action?account=${usuario}&password=${password}`)
        .then((respuesta) => {
        let login_correcto = respuesta.data;
        return res
            .status(200)
            .send({ respuesta: login_correcto, jsession: login_correcto.jsession });
    });
});
rutas_camara.post("/data_correo", (req, res) => {
    let parsedBody = req.body;
    /* console.log("parsedBody.plain", parsedBody.plain); */
    /*  console.log("parsedBody.from", parsedBody.from);
    console.log('parsedBody.headers["Subject"]', parsedBody.headers["Subject"]); */
    /*   console.log("parseBody.html", parsedBody.html);
    console.log("parseBody", parsedBody);
   */
    let alarma = parsedBody.plain;
    /*  let alarma = "MDR210FGSA-10004(IO_1 Alarm Start) 2019-04-13 03:48:52"; */
    let separar_data_alarma = alarma.search("IO_1 Alarm Start");
    let vehiculo_dispositivo = alarma.substring(0, separar_data_alarma - 1);
    //encuentra la hora y dia
    let dia = alarma.substring(alarma.lastIndexOf(" ") - 10, alarma.lastIndexOf(" "));
    let hora = alarma.substring(alarma.lastIndexOf(" ") + 1, alarma.length);
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
            mensaje: "la alarma que quieres emitir ya esta duplicada rey"
        });
    }
    else {
        instanciaCamaras.agregarAlarma(respuesta);
        console.log("agregada");
        console.log(instanciaCamaras.getAlarmas());
        instanciaServidor.io.emit("alarma-dispositivo", respuesta);
        return res.send({
            respuesta
        });
    }
});
rutas_camara.get("/alarmasActivas", (req, res) => {
    return res.send({ alarmas: instanciaCamaras.getAlarmas() });
});
exports.default = rutas_camara;
