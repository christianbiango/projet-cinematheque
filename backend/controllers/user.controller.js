import getUserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Cette fonction inscrit un novuel utilisateur
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * Renvoit status :
 *    - 201 : inscription réussie
 *    - 500 : un compte existe déjà avec cette adresse e-mail / erreur du serveur
 */
export const signup = async (req, res) => {
  try {
    const userModel = await getUserModel();

    const isUsedMail = await userModel.findOne({ email: req.body.email });

    if (isUsedMail) throw new Error("Un compte existe déjà avec ce mail");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès!", newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction connecte l'utilisateur si ses entrées du formulaire de connexion sont valides
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * Renvoit un status :
 *    - 200 : connexion réussie
 *    - 404 : utilisateur non trouvé
 *    - 400 : mot de passe incorrecte
 *    - 500 : erreur du serveur
 */
export const login = async (req, res) => {
  try {
    /*
    if (req.session?.loginTries && req.session?.loginTries >= 2)
      return res.status(401).json({
        message: `Trop de tentatives de connexion échouées (${req.session.loginTries}). Veuillez réessayer ultérieurement.`,
      });
      */

    const wrongCredentials = "Le mail ou le mot de passe sont incorrectes.";
    const userModel = await getUserModel();

    const user = await userModel.findOne({ email: req.body.email });

    //  si l'user n'est pas trouvé, renvoit une erreur 404.
    if (!user) {
      req.session.loginTries++;
      return res.status(404).json({ message: wrongCredentials });
    }
    // compare le mot de passe fourni dans la requete

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      req.session.loginTries++;
      console.log(req.session.loginTries);
      return res.status(400).json({ message: wrongCredentials });
    }

    // Création de la session
    req.session.userId = user._id;
    req.session.username = user.username;
    // Sauvegarder la session
    await req.session.save();
    res.status(200).json({
      message: "Connexion réussie !",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction déconnecte l'utilisateur
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * Renvoit un status :
 *    - 200 : déconnexion réussie réussie,
 *    - 500 : erreur du serveur
 */
export const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).end(); // end() met conclut le processus de réponse sans inclure aucune donnée
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction vérifie si l'utilsateur est connecté à chacune de ses actions
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * Renvoit un status :
 *    - 200 : connexion réussie,
 *    - 404 : d'utilisateur non trouvé,
 *    - 400 : mot de passe incorrecte,
 *    - 500 : erreur du serveur
 */
export const checkSession = async (req, res) => {
  try {
    // Vérifier qu'une session authentifiée existe
    if (req.session && req.session.userId) {
      // Vérifier que la date d'expiration n'est pas passée
      const now = new Date();
      const expiresDate = new Date(req.session.cookie._expires);

      if (now < expiresDate) {
        res.json({
          isLoggedIn: true,
          user: {
            username: req.session.username,
            id: req.session.userId,
          },
        });
      } else {
        logout(); // Détruire la session, puis Mongo Store supprime la sessions dépréciée en bdd dans les 24h
      }
    } else {
      // axios d'AuthContext détectera qu'il s'agit d'une erreur et la requête sera considérée comme échoéue
      res.status(401).json({
        isLoggedIn: false,
        message: "Veuillez-vous connecter pour accéder à la Cinémathèque",
      }); // 401 Unauthorized
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FILMS

/**
 * Cette fonction récupère toutes les préférences  de films associées à un utilisateur.
 * @returns {Object} - Status 200 si la requête a réussi
 */
export const getMoviesPreferences = async (req, res) => {
  try {
    // TODO: peut-etre ajouter getUserModel à un middleware pour pouvori le récup dans chaque callback
    const userModel = await getUserModel();

    const { userId, preferencesString } = req.query;

    const moviesPreferences = await userModel.findById(
      { _id: userId },
      preferencesString
    );

    return res.status(200).json(moviesPreferences);
  } catch (err) {
    console.log(err.message);
  }
};

/**
 * Cette fonction récupère la préférence  de films associées à un utilisateur. Filtre les résultats par lot de 50 pour la pagination
 * @returns {Object} - Status 200 si la requête a réussi
 */
export const getMoviePreference = async (req, res) => {
  try {
    // TODO: peut-etre ajouter getUserModel à un middleware pour pouvori le récup dans chaque callback
    const userModel = await getUserModel();

    const {
      userId,
      pageFirstMovie,
      pageLastMovie,
      currentPage,
      preferenceKey,
    } = req.query;

    const moviesPreference = await userModel
      .findById(userId, preferenceKey)
      .select(preferenceKey);

    const totalMovies = moviesPreference[preferenceKey].length;

    const filteredMovies = moviesPreference[preferenceKey].slice(
      pageFirstMovie,
      pageLastMovie
    );
    console.log(filteredMovies);

    return res.status(200).json({
      movies: filteredMovies,
      totalMovies: totalMovies,
      currentPage: currentPage,
    });
  } catch (err) {
    console.log(err.message);
  }
};

/**
 * Cette fonction toggle les préférences de films d'un utilisateur
 * @returns {Object} - Status 201 : nouvelle préférence ajoutée / Status 200 : préférence supprimée
 */
export const patchMoviePreference = async (req, res) => {
  try {
    const userModel = await getUserModel();
    const { Movie } = res.locals;

    const { userId, movie, preferenceKey } = req.body.params;

    // 1. Récuperer l'utilisateur
    const mongoUser = await userModel.findById({ _id: userId });

    const isInPreference = mongoUser[preferenceKey].some(
      (preferenceMovie) => movie.id === preferenceMovie.id
    );

    // 2. Vérifier si la préférence demandée sur le frontend est déjà présente.
    // Si oui : supprimer
    // Si non : ajouter
    isInPreference;
    if (isInPreference) {
      await userModel.findByIdAndUpdate(userId, {
        $pull: { [preferenceKey]: { id: movie.id } },
      });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { [preferenceKey]: movie }, // $addToSet ajoute  l'objet seulement s'il n'est pas présent dans l'array
      });
    }

    // 3. Récupérer la préférence mise à jour
    const patchedKey = await userModel.findById({ _id: userId }, preferenceKey);

    return res
      .status(isInPreference ? 200 : 201)
      .json(patchedKey[preferenceKey]);
  } catch (err) {
    throw err;
  }
};
