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

  /**
   * Cette fonction tente de connecter l'utilisateur à la Cinémathèque
   * @param {Object} dataForm - Formulaire remplit
   * @returns {boolean} - True : Connexion réussie. Status 404 || 400 : Connexion échouée
   */
  const login = async (dataForm) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post(URL.USER_LOGIN, dataForm, {
        withCredentials: true,
      }); // data = réponse d'axios. // withCredentials : envoit du cookie de session à l'API

      if (status === 200) {
        setUser(data.user);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(err);
      if (
        err.response.status === 404 ||
        err.response.status === 400 ||
        err.response.status === 401
      )
        console.log(err.response.data.message);
      // Mail ou mot de passe incorrecte
      else console.log(err);
      setIsLoading(false);
    }
  };

  /**
   * Cette fonction déconnecte  l'utilisateur et supprime le cookie de session
   * @return {void}
   */
  const logout = async () => {
    try {
      const { data } = await axios.delete(URL.USER_LOGOUT, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.log(err);
    }
    setUser(null);
  };

  /**
   * Cette fonction tente d'inscrire l'utilisateur à la Cinémathèque
   * @param {Object} dataForm - Formulaire remplit
   * @returns {boolean} - True : inscription réussie || void : Inscription échoéue
   */
  const register = async (dataForm) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post(URL.USER_SIGNUP, dataForm, {
        withCredentials: true,
      });
      if (status === 201) {
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 400)
        console.log(err.response.data.message); // Le middleware a échoué
      else console.log(err);
      setIsLoading(false);
    }
  };

  /**
   * Cette fonction vérifie à chaque action si l'utilisateur est connecté. Déclenchée uniquement sur les routes privées.
   * @returns {void} - Applique le state User à null si aucune session détectée.
   */
  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(URL.USER_SESSION, {
        withCredentials: true,
      });

      data.isLoggedIn ? setUser(data.user) : setUser(null);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) console.log(err.response.data.message);
      // Veuillez-vous connecter pour accéder à la Cinémathèqie
      else console.log(err);
      setIsLoading(false);
    }
  };

  const getDBMovies = async () => {
    try {
      const { data, status } = await axios.get(URL.GET_MOVIES, {
        withCredentials: true,
      });
      console.log("data", data);

      if (status === 200) {
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isLoggedIn,
        register,
        getDBMovies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
