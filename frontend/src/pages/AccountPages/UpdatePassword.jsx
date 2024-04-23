import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UpdatePassword = () => {
  const { updatePassword, user } = useContext(AuthContext);
  const [formData, setFormData] = useState([]);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(formData);
  };

  const handleUpdate = async () => {
    const response = await updatePassword(formData, user.id);
  };

  const submitForm = (e) => {
    e.preventDefault();
    checkFormInput();
    if (passwordErrorMessage === "") {
      handleUpdate();
    }
  };

  const checkFormInput = () => {
    const checkPassword = formData.password.trim();
    const checkPasswordConfirm = formData.password.trim();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi : @$!%*?&

    switch (true) {
      // password
      case checkPassword.length === 0 || checkPassword === null:
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
      case checkPasswordConfirm != checkPassword:
        setPasswordErrorMessage("Les mots de passe ne correspondent.");
        break;
      default:
        setPasswordErrorMessage("");
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
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
                placeholder="Nouveau mot de passe"
                onChange={_onChangeInput}
                name="password"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Confirmez le mot de passe :
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password-confirm"
                type="password"
                placeholder="Nouveau mot de passe"
                onChange={_onChangeInput}
                name="password-confirm"
              />
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

export default UpdatePassword;
