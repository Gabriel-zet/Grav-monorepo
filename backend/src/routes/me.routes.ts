import { Router } from "express";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { meController } from "../controllers/me.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { updateMeSchema } from "../schemas/me.schema.js";

export const meRoutes = Router();

meRoutes.get("/me", ensureAuth, meController.get);
meRoutes.patch("/me", ensureAuth, validateRequest(updateMeSchema), meController.update);

