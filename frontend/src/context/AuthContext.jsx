import React, { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { URL } from "../constants/api.js";
import { resetMoviesSlice } from "../redux/movies.reducer.js";
import { resetUsersSlice } from "../redux/users.reducer.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Etat pour suivre si l'uathentification est en cours
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

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
      setIsLoading(false);
      return err.response.data;
    }
  };

  /**
   * Cette fonction déconnecte l'utilisateur :
   *    - Supprime le cookie de session
   *    - Réintialise le store redux
   * @return {void}
   */
  const logout = async () => {
    try {
      // Supprime la session
      await axios.delete(URL.USER_LOGOUT, {
        withCredentials: true,
      });
      setUser(null);

      // Reinitialise le store
      dispatch(resetMoviesSlice());
      dispatch(resetUsersSlice());
    } catch (err) {
      return err.response.data;
    }
    setUser(null);
  };

  /**
   * Cette fonction tente d'inscrire l'utilisateur à la Cinémathèque
   * @param {Object} dataForm - Formulaire remplit
   * @returns {boolean} - True : inscription réussie || void : Inscription échoéue
   */
  const register = async (vtoken) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.get(URL.USER_SIGNUP, {
        params: {
          vtoken: vtoken,
        },
        withCredentials: true,
      });
      if (status === 201) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cette fonction tente d'envoyer un mail de confirmation d'inscription à l'utilisateur
   * @param {Object} dataForm - Formulaire remplit
   * @returns {boolean} - True : inscription réussie || void : Inscription échoéue
   */
  const checkRegister = async (dataForm) => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.post(
        URL.USER_CHECK_SIGNUP,
        dataForm,
        {
          withCredentials: true,
        }
      );
      if (status === 201) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    } finally {
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
      return err.response.data;
    } finally {
      setIsLoading(false);
    }
  };

  // MOVIES

  /**
   * Cette fonction récupère les films en appliquant filtrant 50 articles à la fois, comme la pagination souhaitée en front
   * Si status 200 : Retourne unobjet contenant les données
   * Sinon, aucune donnée retournée
   */
  const getHomeMovies = async (pageFirstMovie, pageLastMovie, currentPage) => {
    try {
      const { data, status } = await axios.get(URL.GET_HOME_MOVIES, {
        params: {
          pageFirstMovie: pageFirstMovie,
          pageLastMovie: pageLastMovie,
          currentPage: currentPage,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction récupère toutes les préférences de films associées à un utilisateur.
   * Si status 200 : Retourne unobjet contenant les données
   * Sinon, aucune donnée retournée
   */
  const getMoviesPreferences = async (preferencesString) => {
    try {
      const { data, status } = await axios.get(URL.GET_MOVIES_PREFERENCES, {
        params: {
          userId: user.id,
          preferencesString: preferencesString,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction récupère la préférence de films associées à un utilisateur. Filtre les résultats par lot de 50 pour la pagination
   * Si status 200 : Retourne unobjet contenant les données
   * Sinon, aucune donnée retournée
   */
  const getMoviePreference = async (query) => {
    try {
      const { pageFirstMovie, pageLastMovie, preferenceKey, currentPage } =
        query;

      const { data, status } = await axios.get(URL.GET_MOVIE_PREFERENCE, {
        params: {
          userId: user.id,
          preferenceKey: preferenceKey,
          pageFirstMovie: pageFirstMovie,
          pageLastMovie: pageLastMovie,
          currentPage: currentPage,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction toggle les préférences de films d'un utilisateur
   * Si status 200/201 : Retourne unobjet contenant les données
   * Sinon, aucune donnée retournée
   */
  const patchMoviePreference = async (movie, preferenceKey) => {
    try {
      const { data, status } = await axios.patch(URL.PATCH_MOVIES_PREFERENCES, {
        params: {
          userId: user.id,
          movie: movie,
          preferenceKey: preferenceKey,
        },
      });

      if (status === 201 || status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction lance un appel au serveur pour effectuer un appel API vers TMDB
   * @param {String} movieTitle
   * @param {Integer} movieYear
   * @returns {String} -  Lien vers la page du film sur TMDB
   */
  const getTMDBMovie = async (movieTitle, movieYear) => {
    try {
      const { data, status } = await axios.get(URL.GET_TMDB_MOVIE, {
        params: {
          title: movieTitle,
          year: movieYear,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction lance un appel au serveur pour effectuer une requête vers l'API des films proches de l'utilisateur
   * @param {Integer} lat
   * @param {Integer} lng
   * @returns {Array} - Objets d'événements listés du plus proche au plus loin géographiquement
   */
  const getMoviesNearUser = async (lat, lng) => {
    try {
      const { data, status } = await axios.get(URL.GET_NEAR_USER_MOVIES, {
        params: {
          lat: lat,
          lng: lng,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction récupère les informations de l'utilisateur sur sa page compte
   * @returns {Object} - Les informations de l'utilisateur connecté
   */
  const getUserInformations = async () => {
    try {
      const { data, status } = await axios.get(URL.GET_USER_INFORMATIONS, {
        params: {
          userId: user.id,
        },
        withCredentials: true,
      });

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction met à jour les informations de l'utilisateur sur sa page compte
   * @returns {Object} - Les informations de l'utilisateur, celles mises à jour comprises
   */
  const updateUserInformations = async (dataForm, userId) => {
    try {
      const { data, status } = await axios.put(
        URL.UPDATE_USER_INFORMATIONS,
        {
          params: {
            dataForm: dataForm,
            userId: userId,
          },
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        setUser({ ...user, username: data.data });
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction met à jour le mot de passe de l'utilisateur lorsque celui-ci est connecté
   * @param {Object} dataForm
   * @param {String} userId
   * @param {Boolean} lostPassword - Est-ce qu'il s'agit d'une demande de récupération de mot de passe ou si l'utilsiateur est déjà connecté
   * @returns {Object} - Le message de succès ou d'échec
   */
  const updatePassword = async (dataForm, userId, lostPassword = false) => {
    try {
      const endpoint = lostPassword
        ? URL.UPDATE_USER_LOST_PASSWORD
        : URL.UPDATE_USER_PASSWORD;
      const { data, status } = await axios.put(
        endpoint,
        {
          params: {
            dataForm: dataForm,
            userId: userId,
          },
        },
        { withCredentials: true }
      );

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction tente d'envoyer un lien de réintialisation de mot de passe à l'utilisateur par mail
   * @param {Object} dataForm
   * @returns {Object} - Le message de succès ou d'erreur
   */
  const updatePasswordRequest = async (dataForm) => {
    try {
      const { data, status } = await axios.post(
        URL.UPDATE_USER_PASSWORD_REQUEST,
        {
          params: {
            dataForm: dataForm,
          },
          withCredentials: true,
        }
      );

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction vérifie que le token de réintialisation de mot de passe est valide
   * @param {String} ptoken
   * @returns {Object} - L'utilisateur, si le token est valide
   */
  const checkRecoverPasswordToken = async (ptoken) => {
    try {
      const { data, status } = await axios.get(
        URL.CHECK_RECOVER_PASSWORD_TOKEN,
        {
          params: {
            ptoken: ptoken,
          },
          withCredentials: true,
        }
      );

      if (status === 200) {
        return data;
      }
    } catch (err) {
      return err.response.data;
    }
  };

  /**
   * Cette fonction supprime définitivement le comtpe d'un utilisateur
   * @param {String} userId
   */
  const deleteAccount = async (userId) => {
    try {
      await axios.delete(URL.DELETE_ACCOUNT, {
        params: {
          userId: userId,
        },
        withCredentials: true,
      });

      return {
        message:
          "Votre compte a été supprimé avec succès. Vous allez être redirigé...",
        status: 204,
      };
    } catch (err) {
      return err.response.data;
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
        checkRegister,
        getHomeMovies,
        getMoviesPreferences,
        patchMoviePreference,
        getMoviePreference,
        getTMDBMovie,
        getMoviesNearUser,
        getUserInformations,
        updateUserInformations,
        updatePassword,
        updatePasswordRequest,
        checkRecoverPasswordToken,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
