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
