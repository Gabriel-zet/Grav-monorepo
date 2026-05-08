
import { prisma } from "./database/prisma.js";
import { Request, Response } from "express";

export const health = async (req: Request, res: Response) => {
  try {
    // Testa de conexão com o banco
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      apiVersion: "1.0.0 - pre-alpha version",
    });
    
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      apiVersion: "1.0.0 - pre-alpha version",
    });
  }
};