import crypto from "crypto";

/**
 * Classe utilitaire pour la gestion des comptes
 */
export class UserAccountUtils {
  static createUniqueToken() {
    return crypto.randomBytes(32).toString("hex");
  }
}
