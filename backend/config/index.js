import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 9000,
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  mongoMoviesDBName: process.env.MONGO_MOVIES_DB_NAME,
  mongoMoviesCollectionName: process.env.MONGO_MOVIES_COLLECTION_NAME,
  mongoUsersDBName: process.env.MONGO_USERS_DB_NAME,
  mongoUsersCollectionName: process.env.MONGO_USERS_COLLECTION_NAME,
  sessionSecret: process.env.SESSION_SECRET,
  sessionExpiresTime: process.env.SESSION_EXPIRES_TIME,
  sessionAutoRemoveInterval: process.env.SESSION_AUTOREMOVE_INTERVAL,
  mongoSessionsCollectionName: process.env.MONGO_SESSIONS_COLLECTION_NAME,
  defaultFirstPage: process.env.DEFAULT_FIRST_PAGE,
  moviesPerPage: process.env.MOVIES_PER_PAGE,
};

export const TMDB = {
  API_KEY: process.env.TMDB_API_KEY,
  BASE_URL: process.env.TMDB_BASE_URL,
  BACKDROP_BASE_URL: process.env.TMDB_BACKDROP_BASE_URL, // L'url avant les image car dans la réponse pour les img on a que la fin
  SMALL_IMG_COVER_BASE_URL: process.env.TMDB_SMALL_IMG_COVER_BASE_URL,
};

export const DATA_CULTURE_GOUV = {
  BASE_URL: process.env.DATA_CULTURE_GOUV_BASE_URL,
  MAX_KM_DISTANCE: process.env.MAX_KM_DISTANCE,
  FETCH_FESTIVAL_LIMIT: process.env.FETCH_FESTIVAL_LIMIT,
};
