import express from "express";
import {
  signup,
  login,
  checkSession,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/session", checkSession);
router.get("/logout", logout);

export default router;
