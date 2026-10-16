import { Router } from "express";
import * as queueController from "../controllers/queueController";
import { authGuard } from "../middleware/authGuard";
import { roleGuard } from "../middleware/roleGuard";

const router = Router();

router.use(authGuard);

// Waiting queue endpoints
router.get("/", queueController.getWaitingQueue);
router.post("/assign-next", roleGuard(["ADMIN", "AGENT"]), queueController.assignNextFromQueue);

// Staff workload and capacity endpoints
router.get("/staff-load", queueController.getStaffLoadSummary);
router.patch("/staff/:id/availability", roleGuard(["ADMIN"]), queueController.toggleStaffAvailability);

// Conflict-checked assignment endpoint
router.post("/tickets/:id/assign", roleGuard(["ADMIN", "AGENT"]), queueController.assignTicketWithValidation);

// Activity logs endpoint
router.get("/activity-logs", queueController.getActivityLogs);

export default router;
