import mongoose from "mongoose";
import { connectDatabases } from "../database/database.conn.js";
import { env } from "../config/index.js";

const { Schema } = mongoose;

/**
 * Cette fonction créer le model pour les requêtes de mots de passe oublié.
 * @returns {Model} - L'Objet UserModel
 */
const getForgottenPasswordModel = async () => {
  try {
    const forgottenPasswordModelName = env.mongoForgottenPasswordCollectionName;

    const { userDB } = await connectDatabases();

    if (!userDB.modelNames().includes(forgottenPasswordModelName)) {
      const templateSchema = {
        account: {
          type: Schema.Types.ObjectId,
          ref: env.mongoUsersCollectionName,
        },
        token: {
          _hex: { type: String, require: true },
          expires: { type: Date, require: true },
        },
      };

      const forgottenPasswordSchema = new Schema(templateSchema, {
        timestamps: { createdAt: true },
      });

      // Assigner le model
      userDB.model(forgottenPasswordModelName, forgottenPasswordSchema);
    }

    // Récupérer le Model de chaque collection
    const a = userDB.model(forgottenPasswordModelName);

    return {
      forgottenPasswordModel: userDB.model(forgottenPasswordModelName),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getForgottenPasswordModel;
