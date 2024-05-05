import React, { useState } from "react";

/**
 * Ce component est utilisé pour mettre en place le formulaire de mise à jour le mot de passe de l'utilisateur
 * @returns
 */
const UpdatePasswordForm = (props) => {
  const { userId, updatePassword, lostPassword } = props;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [updateResult, setUpdateResult] = useState(null);
  const [formData, setFormData] = useState([]);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleUpdate = async () => {
    const response = await updatePassword(formData, userId, lostPassword);
    if (response?.message && response?.status)
      setUpdateResult({
        message: response.message,
        status: response.status,
      });
    else setUpdateResult(response);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const result = checkFormInput();
    if (result) handleUpdate();
  };

  const checkFormInput = () => {
    const checkPassword = formData.password;
    const checkPasswordConfirm = formData.passwordConfirm;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi : @$!%*?&

    switch (true) {
      // password
      case checkPassword === null ||
        checkPassword.length === 0 ||
        checkPassword === null:
        setPasswordErrorMessage("Vous n'avez pas saisi de mot de passe.");
        break;
      case !typeof checkPassword === "string":
        setPasswordErrorMessage("Le format du mot de passe est incorrecte");
        break;
      case !passwordRegex.test(checkPassword):
        setPasswordErrorMessage(
          "Le mot de passe doit être composé d'au minimum 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.\n\nCaractères spéciaux autorisés : @ $ ! % * ? &"
        );
        break;
      default:
        setPasswordErrorMessage("");
    }

    switch (true) {
      case checkPasswordConfirm != checkPassword:
        setPasswordConfirmErrorMessage(
          "Les mots de passe ne correspondent pas."
        );
        break;
      default:
        setPasswordConfirmErrorMessage("");
        return true;
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          {formSubmitted && updateResult && (
            <span
              className={`text-${
                updateResult.status === 200 ? "green" : "red"
              }-500 text-sm`}
            >
              {updateResult.message || updateResult}
            </span>
          )}
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
            Modifier le mot de passe
          </h1>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Nouveau mot de passe :
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                required
                placeholder="Nouveau mot de passe"
                onChange={_onChangeInput}
                name="password"
              />
              {formSubmitted && passwordErrorMessage && (
                <span className="text-red-500 text-sm">
                  {passwordErrorMessage}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="passwordConfirm"
              >
                Confirmez le mot de passe :
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="passwordConfirm"
                type="password"
                required
                placeholder="Nouveau mot de passe"
                onChange={_onChangeInput}
                name="passwordConfirm"
              />
              {formSubmitted && passwordConfirmErrorMessage && (
                <span className="text-red-500 text-sm">
                  {passwordConfirmErrorMessage}
                </span>
              )}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Soumettre
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
