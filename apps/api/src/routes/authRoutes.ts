import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { loginRules, registerRules, tokenRules } from "../validators/auth.validators";
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

router.post(
  "/login",
  loginRules,
  handleInputErrors,
  AuthController.login,
);

export default router;
