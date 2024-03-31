import express from "express";
import {
  signup,
  login,
  checkSession,
  logout,
} from "../controllers/user.controller.js";

import { getMovies } from "../controllers/movie.controller.js";

import loginMiddleware from "../middleware/LoginMiddleware.js";
import registerMiddleware from "../middleware/RegisterMiddleware.js";

const router = express.Router();

router.post("/signup", registerMiddleware, signup);
router.post("/login", loginMiddleware, login);
router.get("/session", checkSession);
router.delete("/logout", logout);

router.get("/movies", getMovies);

export default router;
