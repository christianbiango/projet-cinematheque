import { formValidator } from "./formValidator/FormValidator.js";
import sanitize from "sanitize-html";

/**
 * Ce middleware effectue la vérification des champs entrés dans le formulaire de demande de récupération de mot de passe
 * Status 400 :  erreur(s) dans le formulaire
 */
export default function updatePasswordRequestMiddleware(req, res, next) {
  const { email } = req.body.params.dataForm;
  let reqEmail = email;
  if (email) reqEmail = email.trim().toLowerCase();
  const cleanedEmail = sanitize(reqEmail);
  if (!formValidator.checkEmail(cleanedEmail)) {
    return res.status(400).json({ message: "Email invalide", field: "email" });
  }

  res.locals.email = cleanedEmail;
  next();
}
