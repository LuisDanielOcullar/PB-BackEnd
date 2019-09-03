import { limpiarAlarmas, alarmaAtendida } from "../sockets/sockets";

export default class Camaras {
  private static _instanciaCamaras: Camaras;
  private dispositivos_alarmas: Array<any>;

  //crea una lista vacia con 
  constructor() {
    this.dispositivos_alarmas = [];
  }

  //regresa la instancia de la clase y si no existe la crea
  public static get instanciaCamaras() {
    return this._instanciaCamaras || (this._instanciaCamaras = new Camaras());
  }

  //obtiene array con alarmas
  getAlarmas() {
    return this.dispositivos_alarmas;
  }

  //metodo que verifica si una alarma ya existe
  alarmaDuplicada(alarma: any): Boolean {
    let bandera = false; 
    this.dispositivos_alarmas.forEach(alarmas_actual => {
      if (alarmas_actual.num_dis === alarma.num_dis) {
        bandera = true;
      }
    });
    return bandera;//aqui se le cambia
  }

  //Agrega una  alarma nueva al array
  agregarAlarma(camara_alarma: any) {
    this.dispositivos_alarmas.push(camara_alarma);
  }

  //Elimina una alarma con num_dis especifico
  eliminarAlarma(num_dis: any) {
    this.dispositivos_alarmas = this.dispositivos_alarmas.filter(alarma_dis => {
      return alarma_dis.num_dis !== num_dis;
    });
  }

  //Marca una camara como no activa ni disponible
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
