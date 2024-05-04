import sanitize from "sanitize-html";
import { formValidator } from "./formValidator/FormValidator.js";

/**
 * Ce middleware effectue la vérification des champs entrés dans le formulaire d'inscription.
 * Ne retourne aucune donnée : formulaire valide
 * Status 400 :  erreur(s) dans le formulaire
 */
export default function registerMiddleware(req, res, next) {
  const { email, username, password } = req.body;
  const cleanedEmail = sanitize(email.trim().toLowerCase());
  const cleanedUsername = sanitize(username.trim());
  const cleanedPassword = sanitize(password);

  // Valider l'e-mail
  if (!formValidator.checkEmail(cleanedEmail)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Valider le mot de passe
  if (!formValidator.checkPassword(cleanedPassword)) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  // Valider le nom d'utilisateur
  if (!formValidator.checkUsername(cleanedUsername)) {
    return res.status(400).json({ message: "Nom d'utilisateur invalide" });
  }

  res.locals.username = cleanedUsername;
  res.locals.email = cleanedEmail;
  res.locals.password = cleanedPassword;

  next(); // passer à la fonction register
}
