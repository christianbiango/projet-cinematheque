import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState([]);
  const { user, register } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(formData);
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleRegister();
  };

  const handleRegister = () => {
    if (register(formData)) navigate("/login");
  };

  return (
    <>
      <main className="form-container">
        <h1>Inscrivez-vous à la Cinémathèque</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form" onSubmit={submitForm}>
          {/* Pseudo */}
          <label htmlFor="username">
            Entrez votre nom d&apos;utilisateur :{" "}
          </label>
          <input
            id="username"
            type="text"
            placeholder="Entrez votre nom d'utilsateur"
            name="username"
            onChange={_onChangeInput}
          ></input>

          {/* Email */}
          <label htmlFor="username">Entrez votre Email : </label>
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
          <input type="submit" value="Créer un compte"></input>
        </form>
      </main>
      <button onClick={() => navigate("/login")}>Se connecter</button>
    </>
  );
};

export default Register;
