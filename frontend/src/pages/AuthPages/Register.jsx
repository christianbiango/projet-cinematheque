import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registerResult, setRegisterResult] = useState(null);

  const { user, checkRegister } = useContext(AuthContext);

  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const result = checkFormInput();

    if (result) handleRegister();
  };

  const handleRegister = async () => {
    const registerTryResult = await checkRegister(formData);

    // Le rate limit renverra une chaine de caractère directement alors que notre API renvoit la réponse dans un objet
    if (registerTryResult?.message && registerTryResult?.status)
      setRegisterResult({
        message: registerTryResult.message,
        status: registerTryResult.status,
      });
    else setRegisterResult(registerTryResult);
  };

  const checkFormInput = () => {
    let checkUsername, checkEmail;
    if (formData.username) checkUsername = formData.username.trim();
    if (formData.email) checkEmail = formData.email.trim().toLowerCase();

    const checkPassword = formData.password;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi : @$!%*?&
    const usernameRegex = /^[a-zA-Z0-9éèàôçÉÈÀÔÇ'-]+$/u; // Chiffres, lettres, caractères diacritiques comme é,ê... et apostrophe

    // username
    switch (true) {
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
    }

    // Email
    switch (true) {
      case checkEmail === undefined ||
        checkEmail.length === 0 ||
        checkEmail === null:
        setEmailErrorMessage("Vous avez oublié votre adresse email ?");
        break;
      case checkEmail.length > 32:
        setEmailErrorMessage(
          "L'adresse email ne doit pas dépasser 32 caractères."
        );
        break;
      case !emailRegex.test(checkEmail):
        setEmailErrorMessage("L'adresse email est invalide.");
        break;
      case !typeof checkEmail === "string":
        setEmailErrorMessage(
          "L'adresse email doit contenir uniquement des chaînes de caractères."
        );
        break;
      default:
        setEmailErrorMessage("");
    }

    // Password
    switch (true) {
      case checkPassword === undefined ||
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
        return true;
    }
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {formSubmitted && registerResult && (
            <span
              className={`text-${
                registerResult.status === 201 ? "green" : "red"
              }-500 text-sm`}
            >
              {registerResult.message}
            </span>
          )}
          <h1 className="text-2xl font-semibold mb-4">
            Inscrivez-vous à la Cinémathèque
          </h1>
          <form className="space-y-4" onSubmit={submitForm}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre nom d&apos;utilisateur
                <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                required
                placeholder="Entrez votre nom d'utilisateur"
                name="username"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formSubmitted && usernameErrorMessage && (
                <span className="text-red-500 text-sm">
                  {usernameErrorMessage}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Entrez votre email"
                name="email"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formSubmitted && emailErrorMessage && (
                <span className="text-red-500 text-sm">
                  {emailErrorMessage}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre mot de passe<span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Entrez votre mot de passe"
                name="password"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formSubmitted && passwordErrorMessage && (
                <span className="text-red-500 text-sm">
                  {passwordErrorMessage}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer un compte
            </button>
          </form>
        </div>
      </main>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        Se connecter
      </button>
    </>
  );
};

export default Register;
