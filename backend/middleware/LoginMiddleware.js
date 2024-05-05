import sanitize from "sanitize-html";
import { formValidator } from "./formValidator/FormValidator.js";

/**
 * Ce middleware effectue la vérification des champs entrés dans le formulaire de connexion.
 * Ne retourne aucune donnée : formulaire valide
 * Status 400 :  erreur(s) dans le formulaire
 */
export default function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  let reqEmail = email;
  if (email) reqEmail = email.trim().toLowerCase();
  const cleanedEmail = sanitize(reqEmail);
  const cleanedPassword = sanitize(password);

  // Valider l'e-mail
  if (!formValidator.checkEmail(cleanedEmail)) {
    return res.status(400).json({ message: "Email invalide", field: "email" });
  }

  // Valider le mot de passe
  if (!formValidator.checkLoginPassword(cleanedPassword)) {
    return res
      .status(400)
      .json({ message: "Mot de passe invalide", field: "password" });
  }

  res.locals.email = cleanedEmail;
  res.locals.password = cleanedPassword;
  next(); // passer à la fonction login
}
