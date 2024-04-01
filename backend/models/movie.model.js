import mongoose, { connect } from "mongoose";
import { env } from "../config/index.js";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { connectDatabases } from "../database/database.conn.js";

const { Schema } = mongoose;

/**
 * Cette fonction permet de définir le modèle d'un utilisateur (User) ou le récupérer s'il existe déjà
 * @returns {Object} Objet contenant le schema et le model.
 *    Movie :
 *    - Model représentant les films dans la base de données
 *    Schema :
 *    - Schema du modèle
 */
const getMovieModel = async () => {
  try {
    const modelName = env.mongoMoviesCollectionName;

    const { movieDB } = await connectDatabases();

    if (!movieDB.modelNames().includes(modelName)) {
      const movieSchema = new Schema(
        {
          id: {
            type: Number,
            required: true,
            unique: true,
          },
          titre: {
            type: String,
            required: true,
            unique: true,
          },
          titreOriginal: {
            type: String,
          },
          realisateurs: {
            type: String,
            required: true,
          },
          anneeProduction: {
            type: Number,
            required: true,
          },
          nationalite: {
            type: String,
            required: true,
          },
          duree: {
            type: String,
            required: true,
          },
          genre: {
            type: String,
          },
          synopsis: {
            type: String,
            required: true,
          },
        },
        { timestamps: { createdAt: true } }
      );

      movieSchema.plugin(mongooseUniqueValidator);

      movieDB.model(modelName, movieSchema);
    }

    const Movie = movieDB.model(modelName);

    return Movie;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getMovieModel;
