import rateLimit from "express-rate-limit";

// Rate limiter du formulaire login
export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 3,
  message:
    "Vous avez échoué 3 fois à vous connecter. Veuillez réessayer dans 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter du formulaire d'inscription
export const registerRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 5,
  message:
    "Vous avez tenté de vous inscrire plus de 5 fois. Veuillez réessayer dans 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter de la page de confirmation d'inscription
export const registerValidateRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 5,
  message:
    "Vous avez effectué cette requête un trop grand nombre de fois. Veuillez réessayer dans 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter du formulaire de récupération de mot de passe
export const restorePasswordRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 10,
  message:
    "Vous avez tenté de réinitialiser votre mot de passe plus de 10 fois. Veuillez réessayer dans 5 minutes.",
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

// Rate limiter du formulaire de mise à jour de compte
export const updateAccountRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mn
  max: 5,
  message:
    "Vous avez mis à jour votre compte plus de 5 fois en un lapse de temps court. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
