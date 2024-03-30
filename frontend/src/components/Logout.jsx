import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return <button onClick={handleLogout}>Se déconnecter</button>;
};

export default Logout;
