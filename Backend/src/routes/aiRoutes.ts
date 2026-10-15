import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { authGuard } from "../middleware/authGuard";
import { validateBody } from "../middleware/validate";
import { aiClassifySchema } from "../validators/ticketValidators";

const router = Router();

router.use(authGuard);

router.post("/classify", validateBody(aiClassifySchema), aiController.classifyTicket);

export default router;
