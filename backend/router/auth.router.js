import express from "express";

// Middleware
import registerMiddleware from "../middleware/RegisterMiddleware.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import loginMiddleware from "../middleware/LoginMiddleware.js";

// Controller
import {
  checkSession,
  checkUserSignup,
  login,
  signup,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route gérant la première étape de confirmation par mail pour l'inscription
router.post("/check-signup", registerMiddleware, checkUserSignup);

// Route d'inscription finale
router.get("/signup", signup);

router.post("/login", loginRateLimiter, loginMiddleware, login);
router.get("/session", checkSession);

export default router;
