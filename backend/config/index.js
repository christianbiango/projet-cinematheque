import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 9000,
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  mongoDBName: process.env.MONGO_DB_NAME,
  mongoMoviesCollectionName: process.env.MONGO_MOVIES_COLLECTION_NAME,
  sessionSecret: process.env.SESSION_SECRET,
  sessionExpiresTime: process.env.SESSION_EXPIRES_TIME
};
