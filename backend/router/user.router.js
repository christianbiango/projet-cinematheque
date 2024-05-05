import express from "express";

// CONTROLLERS
import {
  logout,
  getMoviesPreferences,
  getMoviePreference,
  patchMoviePreference,
  getMoviesNearUser,
  getUserInformations,
  updateUserInformations,
  updatePassword,
  deleteAccount,
} from "../controllers/user.controller.js";

import {
  getHomeMovies,
  fetchTMDBAPI,
} from "../controllers/movie.controller.js";

// MIDDLEWARES
import prepareMoviesOperationsMiddleware from "../middleware/prepareMoviesOperationsMiddleware.js";
import {
  updateAccountRateLimiter,
  updatePasswordRateLimiter,
} from "../middleware/rateLimiter.js";
import updateUserMiddleware from "../middleware/UpdateUserMiddleware.js";
import updatePasswordMiddleware from "../middleware/updatePasswordMiddleware.js";

const router = express.Router();

// USER
router.get("/account", getUserInformations);
router.put(
  "/update-account",
  updateAccountRateLimiter,
  updateUserMiddleware,
  updateUserInformations
);
router.put(
  "/update-password",
  updatePasswordRateLimiter,
  updatePasswordMiddleware,
  updatePassword
); // mettre à jouir le mot de passe de l'utilisateur connecté

router.delete("/logout", logout);
router.delete("/delete-account", deleteAccount);

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

// APIS
router.get("/tmdb-movie", fetchTMDBAPI);

// SUGGESTIONS DE FILMS
router.get("/near-movies", getMoviesNearUser);

export default router;
