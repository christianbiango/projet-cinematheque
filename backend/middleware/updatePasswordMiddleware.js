import { formValidator } from "./formValidator/FormValidator.js";
import sanitize from "sanitize-html";

export default function updatePasswordMiddleware(req, res, next) {
  const { password } = req.body.params.dataForm;
  const cleanedPassword = sanitize(password);

  if (!formValidator.checkPassword(cleanedPassword)) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  res.locals.username = cleanedPassword;
  next();
}
