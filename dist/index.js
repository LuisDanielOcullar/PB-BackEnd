"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./app/controllers/server"));
const app_1 = require("./app/app");
const dotenv = __importStar(require("dotenv"));
const server = server_1.default.instance;
dotenv.config();
const app = new app_1.App();
dotenv.config();
server.start(() => {
    console.log(`Servidor levantado en  puerto ${process.env.SERVER_PORT}`);
});
