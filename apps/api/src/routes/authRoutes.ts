import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { registerRules, tokenRules } from "../validators/auth.validators";
import { handleInputErrors } from "../middleware/validation";

const router: Router = Router();

router.post(
  "/create-account",
  registerRules,
  handleInputErrors,
  AuthController.createAccount,
);

router.post(
  "/confirm-account",
  tokenRules,
  handleInputErrors,
  AuthController.confirmAccount,
);

export default router;
