"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rutas_algo = express_1.Router();
rutas_algo.get("/prueba", (req, res) => {
    return res.send({ mensaje: " algo" });
});
exports.default = rutas_algo;
