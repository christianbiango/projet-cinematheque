import { formValidator } from "./formValidator/FormValidator.js";
import sanitize from "sanitize-html";

export default function updatePasswordMiddleware(req, res, next) {
  const { password, passwordConfirm } = req.body.params.dataForm;
  const cleanedPassword = sanitize(password);
  const cleanedPasswordConfirm = sanitize(passwordConfirm);

  if (
    !formValidator.checkPasswordUpdate(cleanedPassword, cleanedPasswordConfirm)
  ) {
    return res
      .status(400)
      .json({ message: "Mot de passe invalide", field: "password" });
  }

  res.locals.password = cleanedPassword;
  next();
}
