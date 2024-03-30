import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Etat pour suivre si l'uathentification est en cours
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    isLoggedIn();
  }, []);

  const login = async (dataForm) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post(URL.USER_LOGIN, dataForm);

      if (status === 200) {
        setUser(data);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await axios.delete(URL.LOGOUT);
      setUser(null);
    } catch (err) {
      console.log(err);
    }
    setUser(null);
  };

  const register = async (dataForm) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post(URL.USER_SIGNUP, dataForm);
      if (status === 201) {
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.get(URL.USER_SESSION);

      status === 200 ? setUser(data) : null;

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
