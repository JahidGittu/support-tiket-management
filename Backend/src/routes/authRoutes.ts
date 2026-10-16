import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { authGuard } from "../middleware/authGuard";
import { registerSchema, loginSchema } from "../validators/authValidators";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authGuard, authController.getMe);
router.get("/staff", authGuard, authController.getStaffList);
router.get("/customers", authGuard, authController.getCustomerList);

export default router;
