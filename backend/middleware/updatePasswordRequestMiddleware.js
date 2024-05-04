import { formValidator } from "./formValidator/FormValidator.js";
import sanitize from "sanitize-html";

export default function updatePasswordRequestMiddleware(req, res, next) {
  const { email } = req.body.params.dataForm;
  const cleanedEmail = sanitize(email.trim().toLowerCase());
  if (!formValidator.checkEmail(cleanedEmail)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  res.locals.email = cleanedEmail;
  next();
}
