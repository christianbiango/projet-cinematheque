import { TMDB, DATA_CULTURE_GOUV } from "../config/index.js";
import axios from "axios";

/**
 * Cette classe exécute des requêtes vers les API TMDB et  Culture.Gouv pour récupérer des données relatives aux films.
 */
export class MovieAPI {
  /**
   * Cette fonction récupère un film de TMDB  en utilisant le titre et la date de publication du film fourni en paramètre.
   * @param {String} title
   * @param {Integer} year
   * @returns {Array} contenant objet du film - ou vide
   */
  static async fetchByTitle(title, year) {
    const response = await axios.get(
      `${TMDB.BASE_URL}/search/movie?api_key=${TMDB.API_KEY}&include_adult=true&language=fr-FR&query=${title}&year=${year}`
    );
    return response.data.results;
  }

  /**
   * Cette fonction récupère les films les plus proches de l'utilisateur s'il a activé sa géolocalisation.
   * @param {Integer} lat
   * @param {Integer} lng
   * @returns  {Array} - d'objets contenant un événement
   */
  static async fetchLocatedFestivals(lat, lng) {
    const limit = Number(DATA_CULTURE_GOUV.FETCH_FESTIVAL_LIMIT); // Eviter l'erreur "Integer awaited"
    const max_km = DATA_CULTURE_GOUV.MAX_KM_DISTANCE;

    const response = await axios.get(
      `${DATA_CULTURE_GOUV.BASE_URL}/records?where=%20within_distance(geocodage_xy%2C%20geom'POINT(${lng}%20${lat})'%2C%20${max_km}km)&limit=${limit}&refine=discipline_dominante%3A%22Cin%C3%A9ma%2C%20audiovisuel%22`
    );
    return response.data.results;
  }
}
