import express from "express";

// Middleware
import registerMiddleware from "../middleware/RegisterMiddleware.js";
import {
  loginRateLimiter,
  registerRateLimiter,
  registerValidateRateLimiter,
  restorePasswordRateLimiter,
  updatePasswordRateLimiter,
} from "../middleware/rateLimiter.js";
import loginMiddleware from "../middleware/LoginMiddleware.js";

// Controller
import {
  checkRecoverPasswordToken,
  checkSession,
  checkUserSignup,
  login,
  signup,
  updatePassword,
  updatePasswordRequest,
} from "../controllers/user.controller.js";
import updatePasswordRequestMiddleware from "../middleware/updatePasswordRequestMiddleware.js";
import updatePasswordMiddleware from "../middleware/updatePasswordMiddleware.js";

const router = express.Router();

// Route gérant la première étape de confirmation par mail pour l'inscription
router.post(
  "/check-signup",
  registerRateLimiter,
  registerMiddleware,
  checkUserSignup
);

// Route d'inscription finale
router.get("/signup", registerValidateRateLimiter, signup);

router.post("/login", loginRateLimiter, loginMiddleware, login);
router.get("/session", checkSession);

router.post(
  "/update-password-request",
  restorePasswordRateLimiter,
  updatePasswordRequestMiddleware,
  updatePasswordRequest
); // Requête de mot de passe oublié, envoit par mail du lien

router.get("/check-recover-password-token", checkRecoverPasswordToken); // Vérification du token Lorsque l'utilisateur entre le lien de récupération de mot de passe
router.put(
  "/update-lost-password",
  updatePasswordRateLimiter,
  updatePasswordMiddleware,
  updatePassword
);

export default router;
