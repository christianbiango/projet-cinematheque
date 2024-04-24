import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UpdatePasswordRequest = () => {
  const { updatePasswordRequest } = useContext(AuthContext);
  const [formData, setFormData] = useState([]);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const _onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(formData);
  };

  const handleRequest = async () => {
    const response = await updatePasswordRequest(formData);
  };

  const submitForm = (e) => {
    e.preventDefault();
    checkFormInput();
    if (emailErrorMessage === "") {
      handleRequest();
    }
  };

  const checkFormInput = () => {
    const checkEmail = formData.email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      default:
        setEmailErrorMessage("");
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
            Entrez votre adresse mail :
          </h1>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Votre mail :
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Votre email"
                onChange={_onChangeInput}
                name="email"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Recouvrir mon mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordRequest;
