import rateLimit from "express-rate-limit";

// Rate limiter du formulaire login
export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 3,
  message:
    "Vous avez effectué plus de 3 fois cette action. Veuillez réessayer dans 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter du formulaire de mise à jour du mot de passe et d'oubli de mot de passe
export const updatePasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30mn
  max: 3,
  message:
    "Vous avez modifié 3 fois votre mot de passe en un court lapse de temps. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
