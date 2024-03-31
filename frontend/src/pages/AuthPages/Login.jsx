import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState([]);
  const { user, isLoading, login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Hook de react router dom

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(formData);
  };

  const handleLogin = async () => {
    const hasLoggedIn = await login(formData);
    if (hasLoggedIn) navigate("/");
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (formData.email.length < 3 || formData.password.length < 1) {
      setErrorMessage(
        "Le pseudo doit comporter au moins 3 caractères et le mot de passe 5 caractères"
      );
    } else {
      handleLogin();
    }
  };

  return (
    <>
      <main className="form-container">
        <h1>Connectez-vous à la Cinémathèque</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form" onSubmit={submitForm}>
          {/* Email */}
          <label htmlFor="email">Entrez votre Email : </label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre email"
            name="email"
            onChange={_onChangeInput}
          ></input>

          {/* Mot de passe */}
          <label htmlFor="password">Entrez votre Mot de passe :</label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            name="password"
            onChange={_onChangeInput}
          ></input>

          {/* Submit */}
          <input type="submit" value="Se connecter"></input>
        </form>
      </main>
      <button onClick={() => navigate("/register")}>S&apos;inscrire</button>
    </>
  );
}
