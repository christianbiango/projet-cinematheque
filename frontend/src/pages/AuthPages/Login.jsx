import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { user, login } = useContext(AuthContext);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const navigate = useNavigate(); // Hook de react router dom

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleLogin = async () => {
    const loginTryResult = await login(formData);
    if (loginTryResult === true) navigate("/");
    else if (loginTryResult?.message)
      setLoginError(loginTryResult.message); // data.message
    else setLoginError(loginTryResult);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const result = checkFormInput();

    if (result) handleLogin();
  };

  const checkFormInput = () => {
    let checkEmail;
    if (formData.email) checkEmail = formData.email.trim().toLowerCase();
    const checkPassword = formData.password;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      // Password
      case checkPassword === undefined ||
        checkPassword.length === 0 ||
        checkPassword === null:
        setPasswordErrorMessage("Vous n'avez pas saisi de mot de passe.");
        break;
      case !typeof checkPassword === "string":
        setPasswordErrorMessage("Le format du mot de passe est incorrecte");
        break;
      default:
        setPasswordErrorMessage("");
        return true; // Toutes les vérifications ont été passées
    }
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {formSubmitted && loginError && (
            <span className="text-red-500 text-sm">{loginError}</span>
          )}
          <h1 className="text-2xl font-semibold mb-4">
            Connectez-vous à la Cinémathèque
          </h1>
          <form className="space-y-4" onSubmit={submitForm}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                Entrez votre Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                name="email"
                required
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formSubmitted && emailErrorMessage && (
                <span className="text-red-500 text-sm">
                  {emailErrorMessage}
                </span>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className=" block text-sm font-medium text-gray-700 text-left"
              >
                Entrez votre Mot de passe<span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                name="password"
                required
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formSubmitted && passwordErrorMessage && (
                <span className="text-red-500 text-sm">
                  {passwordErrorMessage}
                </span>
              )}
            </div>

            <Link to="/recover-password-request">Mot de passe perdu ?</Link>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </form>
        </div>
      </main>
      <button
        onClick={() => navigate("/register")}
        className="mt-4 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        S&apos;inscrire
      </button>
    </>
  );
}
