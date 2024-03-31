import getMovieModel from "../models/movie.model.js";
import { countDBMovies } from "../utils/movie.utils.js";

/**
 * Ce middleware récupère le Model des films et compte le nombre de films en base de données pour effectuer la pagination sur le front
 * @returns {void} - Stocke les données dans les locals de la réponse
 */
export default async function prepareMoviesOperationsMiddleware(
  req,
  res,
  next
) {
  const totalMovies = await countDBMovies();
  const Movie = await getMovieModel();

  res.locals.totalMovies = totalMovies;
  res.locals.Movie = Movie;

  next();
}
