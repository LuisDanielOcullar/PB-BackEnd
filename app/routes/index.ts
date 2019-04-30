import { Router } from "express";

import rutas_camaras from "./prueba/rutas_camaras";
import rutas_algo from "./algo/algo";



const rutas_fin = Router();

/* const instanceServer = Server.instance; */

export = { rutas_camaras, rutas_algo };
