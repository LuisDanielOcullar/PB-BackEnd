import { Router, Request, Response } from "express";

const rutas_algo= Router();

rutas_algo.get("/prueba", (req: Request, res: Response) => {
  return res.send({ mensaje: " algo" });
});

export default rutas_algo;