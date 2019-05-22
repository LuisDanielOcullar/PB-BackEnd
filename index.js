"use strict";
exports.__esModule = true;
var server_1 = require("./app/controllers/server");
var app_1 = require("./app/app");
var dotenv = require("dotenv");
var server = server_1["default"].instance;
dotenv.config();
var app = new app_1.App();
dotenv.config();
server.start(function () {
    console.log("Servidor levantado en  puerto " + process.env.SERVER_PORT);
});
