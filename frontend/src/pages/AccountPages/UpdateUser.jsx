import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const UpdateUser = () => {
  const { updateUserInformations, user } = useContext(AuthContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [updateAccountResult, setUpdateAccountResult] = useState(null);
  const [formData, setFormData] = useState({ username: user.username });
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleUpdate = async () => {
    const response = await updateUserInformations(formData, user.id);
    if (response?.message && response?.status)
      setUpdateAccountResult({
        message: response.message,
        status: response.status,
      });
    else setUpdateAccountResult(response);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const result = checkFormInput();

    if (result) {
      handleUpdate();
    }
  };

  const checkFormInput = () => {
    let checkUsername;
    if (formData.username) checkUsername = formData.username.trim();

    const usernameRegex = /^[a-zA-Z0-9éèàôçÉÈÀÔÇ'-]+$/u; // Chiffres, lettres, caractères diacritiques comme é,ê... et apostrophe

    switch (true) {
      // username
      case checkUsername === undefined ||
        checkUsername.length === 0 ||
        checkUsername === null:
        setUsernameErrorMessage("Vous avez oublié votre nom d'utilisateur ?");
        break;
      case checkUsername.length > 32:
        setUsernameErrorMessage(
          "Le nom d'utilsateur ne doit pas dépasser 32 caractères."
        );
        break;
      case !usernameRegex.test(checkUsername):
        setUsernameErrorMessage(
          "Le nom d'utilsateur ne doit comporter que des lettres, des chiffres ou des tirets."
        );
        break;
      case !typeof checkUsername === "string":
        setUsernameErrorMessage("Le nom d'utilisateur est incorrecte.");
        break;
      default:
        setUsernameErrorMessage("");
        return true;
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          {formSubmitted && updateAccountResult && (
            <span
              className={`text-${
                updateAccountResult.status === 200 ? "green" : "red"
              }-500 text-sm`}
            >
              {updateAccountResult.message}
            </span>
          )}
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
            Modifier les informations du compte
          </h1>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Nouveau pseudo :
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Nouveau pseudo"
                value={formData.username}
                onChange={_onChangeInput}
                name="username"
              />
              {formSubmitted && usernameErrorMessage && (
                <span className="text-red-500 text-sm">
                  {usernameErrorMessage}
                </span>
              )}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>
        <Link to="/account" className="text-indigo-600 hover:text-indigo-700">
          Voir votre compte
        </Link>
      </div>
    </div>
  );
};

export default UpdateUser;
