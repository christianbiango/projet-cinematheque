import express from "express";

// CONTROLLERS
import {
  signup,
  login,
  checkSession,
  logout,
} from "../controllers/user.controller.js";

import { getHomeMovies } from "../controllers/movie.controller.js";

// MIDDLEWARES
import loginMiddleware from "../middleware/LoginMiddleware.js";
import registerMiddleware from "../middleware/RegisterMiddleware.js";
import prepareMoviesOperationsMiddleware from "../middleware/prepareMoviesOperationsMiddleware.js";

const router = express.Router();

// AUTH
router.post("/signup", registerMiddleware, signup);
router.post("/login", loginMiddleware, login);
router.get("/session", checkSession);
router.delete("/logout", logout);

// FILMS
router.get("/movies", prepareMoviesOperationsMiddleware, getHomeMovies);

export default router;
