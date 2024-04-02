import { TMDB } from "../config/index.js";
import axios from "axios";

export class MovieAPI {
  static async fetchPopulars() {
    const response = await axios.get(
      `${BASE_URL}/tv/popular?api_key=${TMDB.API_KEY}`
    );
    return response.data.results;
  }

  static async fetchRecommandations(tvShowId) {
    const response = await axios.get(
      `${BASE_URL}/tv/${tvShowId}/recommendations?api_key=${process.env.REACT_APP_API_KEY_PARAM}`
    );
    return response.data.results;
  }

  static async fetchByTitle(title, year) {
    const response = await axios.get(
      `${TMDB.BASE_URL}/search/movie?api_key=${TMDB.API_KEY}&include_adult=true&language=fr-FR&query=${title}&year=${year}`
    );
    return response.data.results;
  }
}
