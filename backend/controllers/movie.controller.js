import movieSchema from "../models/movie.model.js";
import bcrypt from "bcrypt";
import { env } from "../config/index.js";

// Utils
import {
  retrieveExcelMovies,
  formatExcelMovies,
  createMoviesBulkUpdateArray,
  countDBMovies,
} from "../utils/movie.utils.js";
import getMovieModel from "../models/movie.model.js";

/**
 * Cette fonction  permet de récupérer la liste des films du fichier excel et les enregistrer dans la base de données
 * @return {void}
 */
export const saveMoviesToDB = async () => {
  try {
    const movies = retrieveExcelMovies();
    console.log("Les films ont été récupérés du fichier Excel");

    const formattedMovies = formatExcelMovies(movies);
    console.log("Les films ont été mis au bon format Mongo");

    // Sauvegarder tous les films si la bdd est vide, sinon mettre à jour
    const totalMovies = await countDBMovies();
    const Movie = await getMovieModel();

    if (totalMovies > 0) {
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

/**
 * Cette fonction récupère les films en appliquant filtrant 50 articles à la fois, comme la pagination souhaitée en front
 * @param {Object} req
 * @param {Object} res
 * @returns {void} - Renvoit un status 200 en cas de réussite
 */
export const getHomeMovies = async (req, res) => {
  try {
    const totalMovies = res.locals.totalMovies;
    const Movie = res.locals.Movie;

    const pageFirstMovie = req.query.pageFirstMovie;
    const pageLastMovie = req.query.pageLastMovie;
    const currentPage = req.query.currentPage;

    const movies = await Movie.find({
      id: { $gte: pageFirstMovie, $lt: pageLastMovie },
    });
    res.status(200).json({
      data: {
        movies: movies,
        totalMovies: totalMovies,
        currentPage: currentPage,
      },
    });
  } catch (err) {
    throw err;
  }
};
