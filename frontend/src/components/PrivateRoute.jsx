import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

/**
 * Component parent de toutes les routes privées
 *
 * Vérifie la  connexion et redirige vers le login si non connecté ou vers l'accueil si connecté
 *  */
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? (
    <>
      <NavBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
