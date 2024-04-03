import express from "express";

// CONTROLLERS
import {
  signup,
  login,
  checkSession,
  logout,
  getMoviesPreferences,
  getMoviePreference,
  patchMoviePreference,
  getMoviesNearUser,
} from "../controllers/user.controller.js";

import {
  getHomeMovies,
  fetchTMDBAPI,
} from "../controllers/movie.controller.js";

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
router.get(
  "/movies-preferences",
  prepareMoviesOperationsMiddleware,
  getMoviesPreferences
);
router.get("/movie-preference", getMoviePreference);
router.patch(
  "/patch/movie-preference",
  prepareMoviesOperationsMiddleware,
  patchMoviePreference
);
router.get("/tmdb-movie", fetchTMDBAPI);

// SUGGESTIONS DE FILMS
router.get("/near-movies", getMoviesNearUser);

export default router;
