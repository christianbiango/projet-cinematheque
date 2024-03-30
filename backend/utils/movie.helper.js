import xlsx from "xlsx";
import fs from "fs";
import { env } from "../config/index.js";
import getMovieModel from "../models/movie.model.js";

// movie controller
import { saveMoviesToDB } from "../controllers/movie.controller.js";

/**
 * Cette fonction lit le fichier Excel des films
 * @return {Array} - Un tableau d'objets au format JSON
 */
export const retrieveExcelMovies = () => {
  try {
    const workbook = xlsx.readFile("./xlsx/film.xlsx"); // Le chemin doit correspondre à celui depuis server.js
    const sheetName = env.EXCEL_STYLESHEET_NAME || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error("Le fichier Excel n'a pas pu être lu");
    }

    return xlsx.utils.sheet_to_json(sheet);
  } catch (err) {
    // Relancer l'erreur pour qu'elle soit gérée par nos middlewares
    throw err;
  }
};

/**
 * Cette fonction adapte les clés des colonnes Excel aux clés MongoDB
 * @return {Array} - Un tableau d'objets JS
 */
export const formatExcelMovies = (movies) => {
  const uniqueIdsAndTitles = [];
  const formattedMovies = movies.map((movie) => {
    // some renvoit true si au moins un élément d'uniqueIdsAndTitle passe la condition
    const isDuplicate = uniqueIdsAndTitles.some(
      (item) => item.id === movie.Id || item.titre === movie.Titre
    );

    if (!isDuplicate) {
      // ajouter l'ID et le titre à uniqueIdsAndTitles
      uniqueIdsAndTitles.push({ id: movie.Id, titre: movie.Titre });

      // film formatté
      return {
        id: movie.Id,
        titre: movie.Titre,
        realisateurs: movie["Réalisateurs"],
        anneeProduction: movie["Année de production"],
        nationalite: movie["Nationalité"],
        duree: movie["Durée"],
        genre: movie.Genre,
        synopsis: movie.Synopsis,
      };
    }
  });

  // Les films dupliqués ont été ajoutés en undefined.
  return formattedMovies.filter((movie) => typeof movie !== "undefined");
};

/**
 * Cette fonction réimporte les films Excel si une modification est effectuée. Elle est appelée au lancement du serveur par server.js
 * Aucune valeur retournée.
 */
export const watchExcelFiles = () => {
  fs.watch("./xlsx/film.xlsx", { persistent: true }, (eventType, filename) => {
    // eventType: "rename" | "change" |
    if (eventType === "change") saveMoviesToDB();
  });
  console.log("Watching Excel file film.xlsx...");
};

export const countDBMovies = async () => {
  try {
    const Movie = await getMovieModel();
    return Movie.countDocuments();
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {Array} formattedMovies - Tableau d'objets
 * @returns {Array}
 */
export const createMoviesBulkUpdateArray = (formattedMovies) => {
  // Requête Bulk
  const bulkData = formattedMovies.map((movie) => ({
    updateOne: {
      filter: {
        id: movie.id,
      },
      update: movie,
    },
  }));
  return bulkData;
};
