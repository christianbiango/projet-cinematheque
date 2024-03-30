import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

// Cette fonction inscrit un novuel utilisateur
export const signup = async (req, res) => {
  try {
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

export const login = async (req, res) => {
  try {
    const wrongCredentials = "Le mail ou le mot de passe sont incorrectes.";
    const user = await userModel.findOne({ email: req.body.email });

    //  si l'user n'est pas trouvé, renvoit une erreur 404.
    if (!user) return res.status(404).json(wrongCredentials);
    // compare le mot de passe fourni dans la requete

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) return res.status(400).json(wrongCredentials);

    // Création de la session
    req.session.userId = user._id;
    res.status(200).json("Connexion réussie !");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
