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
    const wrongCredentials = "Le mail ou le mot de passe sont incorrectes.";
    const userModel = await getUserModel();

    const user = await userModel.findOne({ email: req.body.email });

    //  si l'user n'est pas trouvé, renvoit une erreur 404.
    if (!user) return res.status(404).json({ message: wrongCredentials });
    // compare le mot de passe fourni dans la requete

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword)
      return res.status(400).json({ message: wrongCredentials });

    // Création de la session
    req.session.userId = user._id;
    req.session.username = user.username;
    // Sauvegarder la session
    await req.session.save();
    console.log("login", req.session);
    console.log(req.sessionID);
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
