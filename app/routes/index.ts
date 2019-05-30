import { Router } from "express";

import rutas_camaras from "./camaras/rutas_camaras";
import rutas_algo from "./algo/algo";
import rutas_dahua from "./camaras/rutas_camaras_dahua";

const rutas_fin = Router();

/* const instanceServer = Server.instance; */

export = { rutas_camaras, rutas_algo,rutas_dahua };
