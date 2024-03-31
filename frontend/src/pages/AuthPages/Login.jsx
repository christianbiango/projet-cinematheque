import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState([]);
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
    const hasLoggedIn = await login(formData);
    if (hasLoggedIn) navigate("/");
  };

  const submitForm = (e) => {
    e.preventDefault();
    checkFormInput();
    if (emailErrorMessage === "" && passwordErrorMessage === "") {
      handleLogin();
    }
  };

  const checkFormInput = () => {
    const checkEmail = formData.email.trim().toLowerCase();
    const checkPassword = formData.password.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi : @$!%*?&

    switch (true) {
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
      default:
        setEmailErrorMessage("");
        setPasswordErrorMessage("");
    }
  };

  return (
    <>
      <main className="form-container">
        <h1>Connectez-vous à la Cinémathèque</h1>
        <form className="login-form" onSubmit={submitForm}>
          {/* Email */}
          <label htmlFor="email">Entrez votre Email :*</label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre email"
            name="email"
            required
            onChange={_onChangeInput}
          ></input>
          {emailErrorMessage && (
            <span className="error-message">{emailErrorMessage}</span>
          )}

          {/* Mot de passe */}
          <label htmlFor="password">Entrez votre Mot de passe :*</label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            name="password"
            required
            onChange={_onChangeInput}
          ></input>
          {passwordErrorMessage && (
            <span className="error-message">{passwordErrorMessage}</span>
          )}

          {/* Submit */}
          <input type="submit" value="Se connecter"></input>
        </form>
      </main>
      <button onClick={() => navigate("/register")}>S&apos;inscrire</button>
    </>
  );
}
