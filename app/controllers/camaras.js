"use strict";
exports.__esModule = true;
var Camaras = /** @class */ (function () {
    function Camaras() {
        this.dispositivos_alarmas = [];
    }
    Object.defineProperty(Camaras, "instanciaCamaras", {
        get: function () {
            return this._instanciaCamaras || (this._instanciaCamaras = new Camaras());
        },
        enumerable: true,
        configurable: true
    });
    Camaras.prototype.getAlarmas = function () {
        return this.dispositivos_alarmas;
    };
    Camaras.prototype.alarmaDuplicada = function (alarma) {
        var bandera = false;
        this.dispositivos_alarmas.forEach(function (alarmas_actual) {
            if (alarmas_actual.num_dis === alarma.num_dis) {
                bandera = true;
            }
        });
        return bandera; //aqui se le cambia
    };
    Camaras.prototype.agregarAlarma = function (camara_alarma) {
        this.dispositivos_alarmas.push(camara_alarma);
    };
    Camaras.prototype.eliminarAlarma = function (num_dis) {
        this.dispositivos_alarmas = this.dispositivos_alarmas.filter(function (alarma_dis) {
            return alarma_dis.num_dis !== num_dis;
        });
    };
    Camaras.prototype.modificarAlarma = function (num_dis) {
        var alarma_regresar = null;
        this.dispositivos_alarmas.forEach(function (alarma_dis) {
            if (num_dis.num_dis === alarma_dis.num_dis) {
                alarma_dis.activo = false;
                alarma_dis.disponible = false;
                alarma_regresar = alarma_dis;
            }
        });
        return alarma_regresar;
    };
    Camaras.prototype.limpiarAlarmas = function (alarmas) {
        var _this = this;
        var alarmasRegresar = [];
        alarmas.forEach(function (alarma) {
            _this.dispositivos_alarmas.forEach(function (disp, i) {
                if (alarma.num_dis === disp.num_dis) {
                    disp.activo = true;
                    disp.disponible = true;
                    alarmasRegresar.push(disp);
                }
            });
        });
        return alarmasRegresar;
    };
    return Camaras;
}());
exports["default"] = Camaras;
