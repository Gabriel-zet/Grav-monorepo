import { Router } from "express";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { meController } from "../controllers/me.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { changePasswordSchema, updateMeSchema } from "../schemas/me.schema.js";
import { passwordChangeLimiter } from "../middlewares/rateLimiter.js";


export const meRoutes = Router();

meRoutes.get("/me", ensureAuth, meController.get);
meRoutes.patch("/me", ensureAuth, validateRequest(updateMeSchema), meController.update);
meRoutes.patch("/me/password", ensureAuth, passwordChangeLimiter, validateRequest(changePasswordSchema), meController.changePassword);

