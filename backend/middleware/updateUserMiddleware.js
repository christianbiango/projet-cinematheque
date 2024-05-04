import { formValidator } from "./formValidator/FormValidator.js";
import sanitize from "sanitize-html";

export default function updateUserMiddleware(req, res, next) {
  const { username } = req.body.params.dataForm;
  const cleanedUsername = sanitize(username.trim());
  if (!formValidator.checkUsername(cleanedUsername)) {
    return res.status(400).json({ message: "Nom d'utilisateur invalide" });
  }

  res.locals.username = cleanedUsername;
  next();
}
