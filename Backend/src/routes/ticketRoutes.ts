import { Router } from "express";
import * as ticketController from "../controllers/ticketController";
import { authGuard } from "../middleware/authGuard";
import { roleGuard } from "../middleware/roleGuard";
import { validateBody } from "../middleware/validate";
import {
  createTicketSchema,
  updateStatusSchema,
  assignAgentSchema,
  createCommentSchema,
} from "../validators/ticketValidators";

const router = Router();

router.use(authGuard);

router.get("/", ticketController.getTickets);
router.post("/", validateBody(createTicketSchema), ticketController.createTicket);
router.get("/:id", ticketController.getTicket);

router.patch(
  "/:id/status",
  roleGuard(["AGENT", "ADMIN"]),
  validateBody(updateStatusSchema),
  ticketController.updateStatus
);

router.patch(
  "/:id/assign",
  roleGuard(["ADMIN"]),
  validateBody(assignAgentSchema),
  ticketController.assignAgent
);

router.post("/:id/comments", validateBody(createCommentSchema), ticketController.addComment);

export default router;
