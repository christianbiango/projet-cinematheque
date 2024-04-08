import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { connectDatabases } from "../database/database.conn.js";
import { env } from "../config/index.js";
import getMovieModel from "./movie.model.js";

const { Schema, Types } = mongoose;

/**
 * Cette fonction créer l'UserModel. Le modèle effectue des références vers la collection "movies" de la base de données correspondante
 * @returns {Model} - L'Objet UserModel
 */
const getUserModel = async () => {
  try {
    const Movie = await getMovieModel();
    const userModelName = env.mongoUsersCollectionName;
    const userToValidateModelName = env.mongoUsersToValidateCollectionName;

    const moviesDBName = env.mongoMoviesDBName;

    const { userDB } = await connectDatabases();

    if (!userDB.modelNames().includes(userModelName)) {
      const templateSchema = {
        username: { type: String, require: true },
        password: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        role: { type: Number, require: true, default: 0 },
        localization: {
          adress: { type: String, require: false },
          city: { type: String, require: false },
          postal: { type: Number, require: false },
          country: { type: String, require: false },
        },
        seenMovies: [
          {
            unique: false,
            type: Movie.schema,
            ref: `${moviesDBName}.movies`,
          },
        ],
        favouriteMovies: [
          { type: Movie.schema, ref: `${moviesDBName}.movies` },
        ],
        seeLaterMovies: [{ type: Movie.schema, ref: `${moviesDBName}.movies` }],
      };

      const userSchema = new Schema(templateSchema, {
        timestamps: { createdAt: true },
      });

      templateSchema.email = {
        type: String,
        require: true,
        unique: false,
      };
      templateSchema.token = {
        _hex: { type: String, require: true },
        expires: { type: Date, require: true },
      };

      const userToValidateSchema = new Schema(templateSchema, {
        timestamps: { createdAt: true },
      });

      userSchema.plugin(mongooseUniqueValidator);
      // Assigner le model
      userDB.model(userModelName, userSchema);
      userDB.model(userToValidateModelName, userToValidateSchema);
    }

    // Récupérer le Model de chaque collection

    return {
      userModel: userDB.model(userModelName),
      userToValidateModel: userDB.model(userToValidateModelName),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getUserModel;
