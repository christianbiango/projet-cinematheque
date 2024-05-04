import validator from "validator";

/**
 * Cette classe effectue  des vérifications de validation sur les données entrées par l'utilisateur.
 */
export class formValidator {
  /**
   * Cette méthode vérifie le bon format du mail
   * @param {String} email
   * @returns {Boolean}
   */
  static checkEmail(email) {
    // Valider le mail
    return (
      validator.isEmail(email) &&
      email.length > 0 &&
      email !== null &&
      email.length <= 32 &&
      typeof email === "string"
    );
  }

  /**
   * Cette méthode vérifie le bon format du mot de passe
   * @param {String} password
   * @returns {Boolean}
   */
  static checkPassword(password) {
    // Valider le mot de passe
    return (
      validator.matches(
        password,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ) &&
      password.length > 0 &&
      typeof password === "string" &&
      password !== null
    );
  }

  /**
   * Cette méthode vérifie le mot de passe lors de la connexion. Aucun regex n'est passé
   * @param {String} loginPassword
   * @returns {Boolean}
   */
  static checkLoginPassword(loginPassword) {
    return (
      loginPassword.length === 0 ||
      typeof loginPassword !== "string" ||
      loginPassword === null
    );
  }

  /**
   * Cette méthode vérifie le bon format du nom d'utilisateur
   * @param {String} username
   * @returns {Boolean}
   */
  static checkUsername(username) {
    // Valider le nom d'utilisateur
    return (
      validator.matches(username, /^[a-zA-Z0-9éèàôçÉÈÀÔÇ'-]+$/u) &&
      typeof username === "string" &&
      username.length <= 32 &&
      username.length > 0 &&
      username !== null
    );
  }
}
