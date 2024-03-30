import movieSchema from "../models/movie.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import Movie from "../models/movie.model.js";

// Utils
import {
  retrieveExcelMovies,
  formatExcelMovies,
  countDBMovies,
  createMoviesBulkUpdateArray,
} from "../utils/movie.helper.js";

/**
 * Cette fonction  permet de récupérer la liste des films du fichier excel et les enregistrer dans la base de données
 */
export const saveMoviesToDB = async () => {
  try {
    const movies = retrieveExcelMovies();
    console.log("Les films ont été récupérés du fichier Excel");

    const formattedMovies = formatExcelMovies(movies);
    console.log("Les films ont été mis au bon format Mongo");

    // Sauvegarder tous les films si la bdd est vide, sinon mettre à jour
    const moviesCount = await countDBMovies();

    if (moviesCount > 0) {
      const bulkData = createMoviesBulkUpdateArray(formattedMovies);
      await Movie.bulkWrite(bulkData);
      console.log("Mise à jour réussie de tous les films.");
    } else {
      // Bdd vide
      await Movie.insertMany(formattedMovies);
      console.log("Importation des films avec succès dans la base de données.");
    }
  } catch (err) {
    throw err;
  }
};
