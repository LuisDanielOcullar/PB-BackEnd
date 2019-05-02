"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const rutas_camaras_1 = __importDefault(require("./camaras/rutas_camaras"));
const algo_1 = __importDefault(require("./algo/algo"));
const rutas_fin = express_1.Router();
module.exports = { rutas_camaras: rutas_camaras_1.default, rutas_algo: algo_1.default };
