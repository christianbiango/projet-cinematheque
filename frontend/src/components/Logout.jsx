import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Bouton de déconnexion. Détruit la session et redirige vers l'accueil.
 * @returns {Button}
 */
const Logout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return <button onClick={handleLogout}>Se déconnecter</button>;
};

export default Logout;
