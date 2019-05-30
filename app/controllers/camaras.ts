import { limpiarAlarmas, alarmaAtendida } from "../sockets/sockets";

export default class Camaras {
  private static _instanciaCamaras: Camaras;
  private dispositivos_alarmas: Array<any>;
  constructor() {
    this.dispositivos_alarmas = [];
  }

  public static get instanciaCamaras() {
    return this._instanciaCamaras || (this._instanciaCamaras = new Camaras());
  }

  getAlarmas() {
    return this.dispositivos_alarmas;
  }
  alarmaDuplicada(alarma: any): Boolean {
    let bandera = false; 
    this.dispositivos_alarmas.forEach(alarmas_actual => {
      if (alarmas_actual.num_dis === alarma.num_dis) {
        bandera = true;
      }
    });
    return bandera;//aqui se le cambia
  }

  agregarAlarma(camara_alarma: any) {
    this.dispositivos_alarmas.push(camara_alarma);
  }
  eliminarAlarma(num_dis: any) {
    this.dispositivos_alarmas = this.dispositivos_alarmas.filter(alarma_dis => {
      return alarma_dis.num_dis !== num_dis;
    });
  }
  modificarAlarma(num_dis: any) {
    let alarma_regresar = null;
    this.dispositivos_alarmas.forEach(alarma_dis => {
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
      this.dispositivos_alarmas.forEach((disp, i) => {
        if (alarma.num_dis === disp.num_dis) {
          disp.activo = true;
          disp.disponible = true;
          alarmasRegresar.push(disp);
        }
      });
    });
    return alarmasRegresar;
  }
}
