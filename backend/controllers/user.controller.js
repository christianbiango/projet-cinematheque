import getUserModel from "../models/user.model.js";
import getForgottenPasswordModel from "../models/forgottenPassword.model.js";
import bcrypt from "bcrypt";
import sanitize from "sanitize-html";

import { MovieAPI } from "../services/movie.service.js";
import { UserAccountUtils } from "../utils/userAccount.utils.js";
import { EmailAPI } from "../services/emailUser.service.js";

/**
 * Cette fonction vérifie le nouvel utilisateur et envoie un mail de demande de confirmation d'inscription au nouvel utilisateur
 * Retourne le status :
 *    - 201 : inscription réussie - attente de validation par mail
 *    - 400 : un compte existe déjà avec cette adresse e-mail
 */
export const checkUserSignup = async (req, res) => {
  try {
    const { username, email, password } = res.locals;
    const { userModel, userToValidateModel } = await getUserModel();

    const isUsedMail = await userModel.findOne({
      email: email,
    });

    if (isUsedMail)
      return res
        .status(400)
        .json({ message: "Un compte existe déjà avec ce mail" });

    // Formulaire valide -> Stocker l'utilisateur avec token en base de données pour attendre la confirmation par mail
    const hashedPassword = await bcrypt.hash(password, 10);

    const validationToken = UserAccountUtils.createUniqueToken(24); // temps d'expiration du token en heure

    const storeUser = await userToValidateModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      token: validationToken,
    });

    // Envoie le mail de confirmation
    await EmailAPI.sendRegisterValidation(
      storeUser.username,
      storeUser.email,
      validationToken._hex
    );

    res.status(201).json({
      message: "Merci de confirmer votre inscription par mail!",
      status: 201,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction inscrit le nouvel utilisateur si son token de validation est valable
 * Renvoie status :
 *    - 201 : inscription réussie - attente de validation par mail
 *    - 404 : Le compte à valider n'existe plus
 *    -  400 : Token invalide
 */
export const signup = async (req, res) => {
  try {
    const { vtoken } = req.query;
    const { userModel, userToValidateModel } = await getUserModel();

    // Récupérer l'utilisateur ayant le token de l'url
    const newUser = await userToValidateModel.findOne({
      "token._hex": vtoken,
    });

    // Aucun utilisateur dans la collection des utilisateurs à valider
    if (!newUser)
      return res.status(404).json({
        message: "Votre compte n'est pas en attente de validité.",
        status: 404,
      });

    // token expiré
    if (newUser.token.expires < Date.now())
      return res.status(400).json({
        message: "Le jeton n'est plus valide. Merci d'en demander un nouveau",
        status: 400,
      });
    // Token valide
    const newUserToInsert = {
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      role: newUser.role,
      seenMovies: newUser.seenMovies,
      FavouriteMovies: newUser.FavouriteMovies,
      seeLaterMovies: newUser.seeLaterMovies,
    };

    await userModel.create(newUserToInsert);

    // Supprimer l'utilisateur de la collection de validation d'inscription. Il est possible qu'il ait demandé plusieurs fois un mail -> deleteMany
    await userToValidateModel.deleteMany({ email: newUser.email });

    res
      .status(201)
      .json({ message: "Compte activé avec succès!", status: 201 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction connecte l'utilisateur si ses entrées du formulaire de connexion sont valides
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
    const { userModel } = await getUserModel();
    const { email, password } = res.locals;

    const user = await userModel.findOne({ email: email });

    //  si l'user n'est pas trouvé, renvoit une erreur 404.
    if (!user) {
      return res.status(404).json({ message: wrongCredentials });
    }
    // compare le mot de passe fourni dans la requete

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
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
 * Renvoit un status :
 *    - 200 : déconnexion réussie réussie,
 *    - 500 : erreur du serveur
 */
export const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).end(); // end() met conclut le processus de réponse sans inclure aucune donnée
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction supprime le compte de l'utilsateur, ainsi que toutes ses demandes de modification de compte
 * Renvoit un status :
 *    - 204 : Suppression réussie
 */
export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.query;
    const { userModel } = await getUserModel();
    const { forgottenPasswordModel } = await getForgottenPasswordModel();

    // Récupérer les détails de l'utilisateur
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", status: 404 });
    }

    await Promise.all([
      userModel.deleteOne({ _id: userId }),
      forgottenPasswordModel.deleteMany({ _id: userId }),
    ]);

    await EmailAPI.deletedAccountMail(user.username, user.email);

    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction vérifie si l'utilsateur est connecté sur les routes de connexion
 * Renvoit un status :
 *    - 200 : utilisateur connecté,
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
        res.status(200).json({
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
      res.json({
        isLoggedIn: false,
      });
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
    const { userModel } = await getUserModel();

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
    const { userModel } = await getUserModel();

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
    const { userModel } = await getUserModel();
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

/**
 * Cette fonction permet de récupérer les événements proches de la localisation de l'utilisateur.
 * @returns {Array} (200) - Contient les films fetchés, sinon vide
 */
export const getMoviesNearUser = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const festivals = await MovieAPI.fetchLocatedFestivals(lat, lng);

    return res.status(200).json(festivals); // Array vide si aucun festival trouvé
  } catch (err) {
    throw err;
  }
};

/**
 * Cette fonction permet de récupérer toutes les informations de l'utilisateur connecté
 * @returns {Object} - les informations du compte
 */
export const getUserInformations = async (req, res) => {
  try {
    const { userId } = req.query;
    const { userModel } = await getUserModel();

    const user = await userModel.findById(userId);

    return res.status(200).json(user);
  } catch (err) {
    throw err;
  }
};

/**
 * Cette fonction met à jour les informations de l'utilisateur connecté
 * @returns {Object} - Le message de succès en status 200
 */
export const updateUserInformations = async (req, res) => {
  try {
    const { userId } = req.body.params;
    const { username } = res.locals;
    const { userModel } = await getUserModel();

    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      { username: username } // On ne récupère que l'username pour ne pas mettre à jour un autre champs accidentellement
      //{ new: true } // Pour retourner le document après la mise à jour
    );

    return res.status(200).json({
      message: "Compte mis à jour avec succès!",
      status: 200,
      data: username,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction met à jour le mot de passe de l'utilisateur
 * Renvoie status :
 *    - 200 : Mot de passe mis à jour
 */
export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.body.params;
    const { password } = res.locals;
    const { userModel } = await getUserModel();
    const { forgottenPasswordModel } = await getForgottenPasswordModel();

    // 1. Vérifier que le compte est toujours en attente de récupération de mot de passe
    const forgottenUser = await forgottenPasswordModel.findOne({
      _id: userId,
    });

    if (!forgottenUser)
      return res.status(404).json({
        message:
          "Le compte n'est pas en attente de récupération de mot de passe",
        status: 404,
      });

    /* Vérifier que le nouveau mot de passe n'est pas le même que l'ancien */

    // 2. Récupérer l'ancien mot de passe
    const currentUser = await userModel.findOne({
      _id: userId,
    });

    if (!currentUser)
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable", status: 404 });

    const currentUserHashedPassword = currentUser.password;

    // 3. Comparer les deux mots de passe
    const comparePassword = await bcrypt.compare(
      password,
      currentUserHashedPassword
    );

    if (comparePassword)
      return res.status(400).json({
        message:
          "Le nouveau mot de passe ne peut pas être identique au précédent",
        status: 400,
      });

    /* Mettre à jour le mot de passe */

    const hashedPassword = await bcrypt.hash(password, 10);
    currentUser.password = hashedPassword;
    await currentUser.save();

    // Supprimer toute occurrence de mot de passe oublié
    await forgottenPasswordModel.deleteMany({ _id: userId });

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès !", status: 200 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction transmet le lien de récupération de mot de passe par mail
 * Renvoie status :
 *    - 200 : Un mail a tenté d'être enovyé par le serveur
 */
export const updatePasswordRequest = async (req, res) => {
  try {
    const { email } = res.locals;
    const { userModel } = await getUserModel();
    const { forgottenPasswordModel } = await getForgottenPasswordModel();

    const emailUser = await userModel.findOne({ email: email });

    // On n'envoit un mail que si un compte existe bien avec le mail
    if (emailUser) {
      const validationToken = UserAccountUtils.createUniqueToken(2); // temps d'expiration en heure

      // Envoie le mail de confirmation
      await EmailAPI.sendPasswordRecoverLink(
        emailUser.username,
        email,
        validationToken._hex
      );

      // Enregistrer la requête
      await forgottenPasswordModel.create({
        account: emailUser._id,
        token: validationToken,
      });
    }

    res.status(200).json({
      message:
        "Si un compte est associé à ce mail, vous obtiendrez un lien d'accès par mail.",
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cette fonction vérifie le token de changement de mot de passe lorsque l'utilsiateur  clique sur le lien reçu dans son mail
 * Renvoie status :
 *    - 200 : le compte associé à l'utilisateur
 */
export const checkRecoverPasswordToken = async (req, res) => {
  try {
    const { ptoken } = req.query;

    const { forgottenPasswordModel } = await getForgottenPasswordModel();

    // Récupérer le compte associé
    const recoverDocument = await forgottenPasswordModel.findOne({
      "token._hex": ptoken,
    });

    if (!recoverDocument)
      return res.status(404).json({
        message: "Le jeton n'est pas valide, merci d'en demander un autre.",
        status: 404,
      });

    // token expiré
    if (recoverDocument.token.expires < Date.now())
      return res.status(400).json({
        message: "Le jeton n'est plus valide. Merci d'en demander un nouveau.",
        status: 400,
      });

    // Token valide
    res.status(200).json({ data: recoverDocument.account, status: 200 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
