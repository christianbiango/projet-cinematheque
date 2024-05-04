import validator from "validator";

/**
 * Ce middleware effectue la vérification des champs entrés dans le formulaire de connexion.
 * Ne retourne aucune donnée : formulaire valide
 * Status 400 :  erreur(s) dans le formulaire
 */
export default function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  // Valider l'e-mail
  if (
    !validator.isEmail(email) ||
    email.length === 0 ||
    email === null ||
    email.length > 32 ||
    !typeof email === "string"
  ) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Valider le mot de passe
  if (
    password.length === 0 ||
    typeof password !== "string" ||
    password === null
  ) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  next(); // passer à la fonction login
}
