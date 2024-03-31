import validator from "validator";

export default function registerMiddleware(req, res, next) {
  const { email, username, city, postal, country, address, password } =
    req.body;

  // Valider l'e-mail
  if (
    !validator.isEmail(email) ||
    email.length === 0 ||
    email === null ||
    email.length > 32 ||
    !typeof email === "string"
  ) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Valider le mot de passe
  if (
    !validator.matches(
      password,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ) ||
    password.length === 0 ||
    typeof password !== "string" ||
    password === null
  ) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  // Valider le nom d'utilisateur
  if (
    !validator.matches(username, /^[a-zA-Z0-9éèàôçÉÈÀÔÇ'-]+$/u) ||
    !typeof username === "string" ||
    username.length > 32 ||
    username.length === 0 ||
    username === null
  ) {
    return res.status(400).json({ message: "Nom d'utilisateur invalide" });
  }

  // Valider la ville
  if (city.length !== 0) {
    if (
      !validator.matches(city, /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/) ||
      typeof city !== "string"
    ) {
      return res.status(400).json({ message: "Ville invalide" });
    }
  }

  // Valider le code postal
  if (postal.length > 0) {
    if (
      !validator.matches(postal, /^\d+$/) ||
      typeof postal !== "string" ||
      isNaN(postal)
    ) {
      return res.status(400).json({ message: "Code postal invalide" });
    }
  }

  // Valider le pays
  if (country.length > 0) {
    if (
      !validator.matches(country, /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/) ||
      typeof country !== "string"
    ) {
      return res.status(400).json({ message: "Pays invalide" });
    }
  }

  // Valider l'adresse
  if (address.length > 0) {
    if (
      !validator.matches(address, /^\d+\s[A-Za-z\s-]+$/i) ||
      typeof address !== "string"
    ) {
      return res.status(400).json({ message: "Adresse invalide" });
    }
  }
  next(); // passer à la fonction register
}