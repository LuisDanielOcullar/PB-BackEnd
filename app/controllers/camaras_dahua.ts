import { limpiarAlarmas, alarmaAtendida } from "../sockets/sockets";
import { USER_DAHUA, PASSWORD_DAHUA } from "../../global/enviroment";
var rtsp = require("rtsp-ffmpeg");

export default class CamarasDahua {
  private static _instanciaCamarasDahua: CamarasDahua;
  private dispositivos_alarmas_dahua: Array<any>;
  private stream_alarmas: Array<any>;
 datatemp: any;

  constructor() {
    this.dispositivos_alarmas_dahua = [];
    this.stream_alarmas = [];
  }

  public static get instanciaCamarasDahua() {
    return (
      this._instanciaCamarasDahua ||
      (this._instanciaCamarasDahua = new CamarasDahua())
    );
  }

  getAlarmas() {
    return this.dispositivos_alarmas_dahua;
  }
  regresardatatemp() {
    return this.datatemp;
  }
  alarmaDuplicada(alarma: any): Boolean {
    let bandera = false;
    this.dispositivos_alarmas_dahua.forEach(alarmas_actual => {
      if (alarmas_actual.num_dis === alarma.num_dis) {
        bandera = true;
      }
    });
    return bandera; //aqui se le cambia
  }

  agregarAlarma(camara_alarma: any) {
    this.dispositivos_alarmas_dahua.push(camara_alarma);
  }

  agregarStreamArreglo(stream: any, num_dis: any, pipeStream: any) {
    let data = { stream, num_dis, pipeStream };
    this.stream_alarmas.push(data);
  }

  regresaTodosStreamActivos() {
    return this.stream_alarmas;
  }
  eliminarAlarma(num_dis: any) {
    this.eliminarStream(num_dis);
    this.dispositivos_alarmas_dahua = this.dispositivos_alarmas_dahua.filter(
      alarma_dis => {
        return alarma_dis.num_dis !== num_dis;
      }
    );
  }
  modificarAlarma(num_dis: any) {
    let alarma_regresar = null;
    this.dispositivos_alarmas_dahua.forEach(alarma_dis => {
      if (num_dis.num_dis === alarma_dis.num_dis) {
        alarma_dis.activo = false;
        alarma_dis.disponible = false;
        alarma_regresar = alarma_dis;
      }
    });

    return alarma_regresar;
  }

  limpiarAlarmas(alarmas: any) {
    let alarmasRegresar: Array<any> = [];
    alarmas.forEach((alarma: any) => {
      this.dispositivos_alarmas_dahua.forEach((disp, i) => {
        if (alarma.num_dis === disp.num_dis) {
          disp.activo = true;
          disp.disponible = true;
          alarmasRegresar.push(disp);
          this.eliminarStream(alarma.num_dis);
        }
      });
    });
    return alarmasRegresar;
  }

  regresaStream(uri: any, dispositivo: any) {
    var stream = new rtsp.FFMpeg({
      input: uri,
      resolution: "320x240",
      quality: 3
    });
    stream.on("start", function() {
      console.log("Transmisión del dispositivo " + dispositivo + " iniciada");
    });
    stream.on("stop", function() {
      console.log("Transmisión del dispositivo " + dispositivo + " detenida");
    });
    return stream;
  }

  eliminarStream(num_dis: any) {
    this.stream_alarmas.forEach(alarma_stream => {
      if (num_dis === alarma_stream.num_dis) {
        console.log("te rifaste rey");
        alarma_stream.stream.removeListener("data", alarma_stream.pipeStream);  
      }
    });
    this.stream_alarmas = this.stream_alarmas.filter(alarmaStream => {
      return alarmaStream.num_dis !== num_dis;
    });
  }
}
