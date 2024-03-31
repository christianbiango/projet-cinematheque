import express from "express";
import {
  signup,
  login,
  checkSession,
  logout,
} from "../controllers/user.controller.js";

import { getMovies } from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/session", checkSession);
router.delete("/logout", logout);

router.get("/movies", getMovies);

export default router;
