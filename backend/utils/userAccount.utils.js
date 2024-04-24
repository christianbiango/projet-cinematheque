import crypto from "crypto";

/**
 * Classe utilitaire pour la gestion des comptes
 */
export class UserAccountUtils {
  static createUniqueToken(expiresTimeInHours) {
    const tokenExpiresDate = new Date();
    tokenExpiresDate.setHours(tokenExpiresDate.getHours() + expiresTimeInHours);

    return {
      _hex: UserAccountUtils._createUniqueHex(),
      expires: tokenExpiresDate,
    };
  }
  static _createUniqueHex() {
    return crypto.randomBytes(32).toString("hex");
  }
}
