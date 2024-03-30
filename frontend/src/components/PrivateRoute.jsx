import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Logout from "./Logout";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? (
    <>
      <Outlet />
      <Logout />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
