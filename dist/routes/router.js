"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
/* const instanceServer = Server.instance; */
router.get("/prueba", (req, res) => {
    return res.send({ mensaje: " esta arriba todo el respectivo asunto" });
});
exports.default = router;
