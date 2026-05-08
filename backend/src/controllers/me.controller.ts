import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";

export const meController = {
  async get(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const user = await usersService.getById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    
    const { passwordHash, refreshToken, refreshTokenExpiresAt, ...safeUser } = user as any;

    return res.json(safeUser);
  },


  async update(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

    const { weightKg } = req.body as { weightKg?: number | null };

    if (typeof weightKg === "undefined") {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const weightG =
      weightKg === null ? null : Math.round(weightKg * 1000);

    const updated = await usersService.updateById(req.userId, { weightG });

    return res.json(updated);
  },  


    async changePassword(req: Request, res: Response) {
    if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

    const { currentPassword, newPassword } = req.body as any;

    const result = await usersService.changePassword(req.userId, { currentPassword, newPassword });

    if (result === null) return res.status(404).json({ message: "User not found" });
    if (result === "INVALID_CURRENT_PASSWORD") {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    return res.json({ message: "Password changed successfully", user: result });
  },
};