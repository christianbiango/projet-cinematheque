import movieSchema from "../models/movie.model.js";
import bcrypt from "bcrypt";
import { env, TMDB } from "../config/index.js";

// Utils
import {
  retrieveExcelMovies,
  formatExcelMovies,
  createMoviesBulkUpdateArray,
  countDBMovies,
} from "../utils/movie.utils.js";
import { MovieAPI } from "../services/movie.service.js";
import getMovieModel from "../models/movie.model.js";
import getUserModel from "../models/user.model.js";

/**
 * Cette fonction  permet de récupérer la liste des films du fichier excel et effectue deux actions :
 *    - Les enregistrer/mettre dans la base de données.
 *    - Mettre à jour les préférences de films des utilisateurs, car ces derniers ne sont pas associés par une clé étrangère. Ils partagent juste le même Schema.
 * @return {void}
 */
export const saveMoviesToDB = async () => {
  try {
    const movies = retrieveExcelMovies();
    console.log("Les films ont été récupérés du fichier Excel");

    const formattedMovies = formatExcelMovies(movies);
    console.log("Les films ont été mis au bon format Mongo");

    // Nous sauvegarderons tous les films si la bdd est vide, sinon nous mettrons à jour
    const totalMovies = await countDBMovies();
    const Movie = await getMovieModel();

    // Supprimer les films dépréciés du Mongo
    const allExcelIds = formattedMovies.map((movie) => movie.id);
    const allMovies = await Movie.find();
    // 1. filter -> map
    const deprecatedIds = allMovies
      .filter((movie) => !allExcelIds.includes(movie.id))
      .map((movie) => movie.id);
    // 2. Suppression
    if (deprecatedIds.length > 0) {
      const deletedMovies = await Movie.deleteMany({
        id: { $in: deprecatedIds },
      });
      console.log(deletedMovies.deletedCount + " film(s) supprimé(s)");
    }

    // Mettre à jour la bdd non vide
    if (totalMovies > 0) {
      // Mettre à jour la base de données des films
      const bulkData = createMoviesBulkUpdateArray(formattedMovies);

      const bulkResult = await Movie.bulkWrite(bulkData);
      console.log("Mise à jour réussie de tous les films.");

      // Mettre à jour les films dans les préférences de la base de données Users, si nécessaire
      if (bulkResult && bulkResult.modifiedCount > 0) {
        // modifiedCount est renvoyé par l'opération Bulk

        const userModel = await getUserModel();

        // 1. Récupérer tous les utilisateurs
        const allMoviesIds = formattedMovies.map((movie) => movie.id);

        // Traduction : Trouve tous les utilisateurs dont un ID dans les clés suivantes se trouve dans notre liste de tous les films.
        const users = await userModel.find({
          $or: [
            { "favouriteMovies.id": { $in: allMoviesIds } },
            { "seenMovies.id": { $in: allMoviesIds } },
            { "seeLaterMovies.id": { $in: allMoviesIds } },
          ],
        });

        // Mettre à jour les références dans les documents des utilisateurs
        const keys = ["favouriteMovies", "seenMovies", "seeLaterMovies"];
        // Promise.all pour attendre la mise à jour de tous les utilisateurs avant de continuer
        await Promise.all(
          // Mapper sur les users nécessitant une MAJ
          users.map(async (user) => {
            // forEach sur les 3 clés de l'utilisateur
            keys.forEach((key) => {
              // forEach sur tous les films de la clé de l'itération
              user[key].forEach((keyMovie) => {
                const updatedMovie = formattedMovies.find(
                  (movie) => movie.id === keyMovie.id
                );
                // Object.assign remplace les clés portant le même nom, et laisse les clés qui sont uniques dans l'objet de base
                if (updatedMovie) {
                  Object.assign(keyMovie, updatedMovie);
                }
              });
              // Mise à jour de l'utilsateur
            });

            await user.save();
            // Fin de users.map()
            // filtre pour retirer les films dépréciés
          })
        );

        // suppr
        const bulkOperations = [];

        // Boucler sur chaque utilisateur
        for (const user of users) {
          const filter = {
            _id: user._id,
            $or: [
              { "favouriteMovies.id": { $in: deprecatedIds } },
              { "seenMovies.id": { $in: deprecatedIds } },
              { "seeLaterMovies.id": { $in: deprecatedIds } },
            ],
          };

          const update = {
            $pull: {
              favouriteMovies: { id: { $in: deprecatedIds } },
              seenMovies: { id: { $in: deprecatedIds } },
              seeLaterMovies: { id: { $in: deprecatedIds } },
            },
          };

          // Ajouter l'opération à la liste des opérations en vrac
          bulkOperations.push({
            updateOne: {
              filter,
              update,
            },
          });
        }

        // Exécuter les opérations en vrac
        await userModel.bulkWrite(bulkOperations);
      }
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
 * @returns {Object} - Renvoit un status 200 en cas de réussite
 */
export const getHomeMovies = async (req, res) => {
  try {
    const { totalMovies, Movie } = res.locals;

    const { pageFirstMovie, pageLastMovie, currentPage } = req.query;

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
/**
 * Cette fonction récupère cherche l'image du film passé en paramètre dans l'API TMDB.
 * @returns {String} - URL de l'image | Undefined
 */
export const fetchTMDBAPI = async (req, res) => {
  try {
    const { title, year } = req.query;

    const movies = await MovieAPI.fetchByTitle(title, year);
    let imageUrl = movies[0]?.backdrop_path; // ?. Renvoit undefined si le clé est indéfinie

    if (imageUrl === null) imageUrl = undefined;

    if (imageUrl !== undefined) imageUrl = TMDB.BACKDROP_BASE_URL + imageUrl;

    res.status(200).json(imageUrl);
  } catch (err) {
    throw err;
  }
};
