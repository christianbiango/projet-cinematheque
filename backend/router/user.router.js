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
  updatePasswordRequest,
  checkRecoverPasswordToken,
} from "../controllers/user.controller.js";

import {
  getHomeMovies,
  fetchTMDBAPI,
} from "../controllers/movie.controller.js";

// MIDDLEWARES
import prepareMoviesOperationsMiddleware from "../middleware/prepareMoviesOperationsMiddleware.js";
import { updatePasswordRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// USER
router.get("/account", getUserInformations);
router.put("/update-account", updateUserInformations);
router.put("/update-password", updatePasswordRateLimiter, updatePassword); // mettre à jouir le mot de passe de l'utilisateur connecté
router.post("/update-password-request", updatePasswordRequest); // Requête de mot de passe oublié, envoit par mail du lien
router.get("/check-recover-password-token", checkRecoverPasswordToken); // Vérification du token Lorsque l'utilisateur entre le lien de récupération de mot de passe
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

// APIS
router.get("/tmdb-movie", fetchTMDBAPI);

// SUGGESTIONS DE FILMS
router.get("/near-movies", getMoviesNearUser);

export default router;
