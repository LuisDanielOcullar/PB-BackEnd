"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./app/controllers/server"));
const enviroment_1 = require("./global/enviroment");
const app_1 = require("./app/app");
const server = server_1.default.instance;
const app = new app_1.App();
server.start(() => {
    console.log(`Servidor levantado en  puerto ${enviroment_1.SERVER_PORT}`);
});
