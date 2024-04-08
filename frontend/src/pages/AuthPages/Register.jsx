import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState([]);
  const { user, register } = useContext(AuthContext);

  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  const [cityErrorMessage, setCityErrorMessage] = useState("");
  const [postalErrorMessage, setPostalErrorMessage] = useState("");
  const [countryErrorMessage, setCountryErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(formData);
  };

  const submitForm = (e) => {
    e.preventDefault();
    checkFormInput();
    handleRegister();
  };

  const handleRegister = () => {
    if (register(formData)) navigate("/login");
  };

  const checkFormInput = () => {
    const checkUsername = formData.username.trim();
    const checkEmail = formData.email.trim().toLowerCase();
    const checkPassword = formData.password.trim();
    const checkAddress = formData.address.trim();
    const checkCity = formData.city.trim();
    const checkPostal = formData.postal.trim();
    const checkCountry = formData.country.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi : @$!%*?&
    const usernameRegex = /^[a-zA-Z0-9éèàôçÉÈÀÔÇ'-]+$/u; // Chiffres, lettres, caractères diacritiques comme é,ê... et apostrophe
    const addressRegex = /^\d+\s[A-Za-z\s-]+$/i; // Chiffre, puis nom de la rue

    const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/; // Caractères alphabétiques/accentués, tirets
    const postalRegex = /^\d+$/; // Nombre entier positif

    switch (true) {
      // username
      case checkUsername.length === 0 || checkUsername === null:
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

      // Addresse
      case checkAddress.length !== 0:
        if (typeof checkAddress !== "string")
          setAddressErrorMessage("Le format de l'addresse est incorrect");
        else if (!addressRegex.test(checkAddress))
          setAddressErrorMessage(
            "L'addresse doit commencer par un chiffre puis contenir le nom de la rue."
          );
        break;

      // Ville
      case checkCity.length !== 0:
        if (typeof checkCity !== "string")
          setCityErrorMessage("Le format de la ville est incorrect");
        else if (!cityRegex.test(checkCity))
          setCityErrorMessage(
            "La ville doit contenir des caractères alphabétiques ou accentués ou des tirets"
          );
        break;
      // Postal
      case checkPostal.length !== 0 || checkPostal !== null:
        if (typeof checkPostal !== "string" || isNaN(checkPostal))
          setPostalErrorMessage(
            "Le code postal doit être un nombre entier positif"
          );
        else if (!postalRegex.test(checkPostal))
          setPostalErrorMessage(
            "Le code postal doit être un nombre entier positif"
          );
        break;

      // Pays
      case checkCountry.length !== 0 || checkCountry !== null:
        if (typeof checkCountry !== "string")
          setCityErrorMessage("Le format du pays est incorrect");
        else if (!cityRegex.test(checkCountry))
          setCountryErrorMessage(
            "Le pays doit contenir des caractères alphabétiques ou accentués ou des tirets"
          );
        break;
      // Email
      case checkEmail.length === 0 || checkEmail === null:
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
      // Password
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
      default:
        setUsernameErrorMessage("");
        setEmailErrorMessage("");
        setPasswordErrorMessage("");
        setAddressErrorMessage("");
        setCityErrorMessage("");
        setPostalErrorMessage("");
        setCountryErrorMessage("");
    }
  };

  return (
    <>
      <main className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
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
                Entrez votre nom d'utilisateur
                <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                name="username"
                required
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {usernameErrorMessage && (
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
                placeholder="Entrez votre email"
                name="email"
                required
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {emailErrorMessage && (
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
                placeholder="Entrez votre mot de passe"
                name="password"
                required
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {passwordErrorMessage && (
                <span className="text-red-500 text-sm">
                  {passwordErrorMessage}
                </span>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre adresse
              </label>
              <input
                id="address"
                type="text"
                placeholder="Entrez votre adresse"
                name="address"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {addressErrorMessage && (
                <span className="text-red-500 text-sm">
                  {addressErrorMessage}
                </span>
              )}
            </div>

            {/* Ville */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre ville
              </label>
              <input
                id="city"
                type="text"
                placeholder="Entrez votre ville"
                name="city"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {cityErrorMessage && (
                <span className="text-red-500 text-sm">{cityErrorMessage}</span>
              )}
            </div>

            {/* Postal */}
            <div>
              <label
                htmlFor="postal"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre code postal
              </label>
              <input
                id="postal"
                type="number"
                placeholder="Entrez votre code postal"
                name="postal"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {postalErrorMessage && (
                <span className="text-red-500 text-sm">
                  {postalErrorMessage}
                </span>
              )}
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Entrez votre pays
              </label>
              <input
                id="country"
                type="text"
                placeholder="Entrez votre pays"
                name="country"
                onChange={_onChangeInput}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {countryErrorMessage && (
                <span className="text-red-500 text-sm">
                  {countryErrorMessage}
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
