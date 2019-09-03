import { Router, Request, Response } from "express";

const rutas_algo= Router();

rutas_algo.get("/", (req: Request, res: Response) => {
  return res.send({ mensaje: " Servidor levantado de manera correcta" });
});

export default rutas_algo;