import mongoose from "mongoose";
import { env } from "../config/index.js";

let movieDB, userDB;

/**
 * Cette fonction établit une connexion aux bases de données Movies et Users
 * @returns {Object} - Object contenant les deux bases de données
 */
export const connectDatabases = async () => {
  try {
    const dbNames = [env.mongoMoviesDBName, env.mongoUsersDBName];
    const [movieDBName, userDBName] = dbNames;
    if (!movieDB || !userDB) {
      // 1. Promesses de connexion aux bases de données
      const movieDBPromise = await mongoose
        .createConnection(env.mongoURI, {
          dbName: movieDBName,
        })
        .asPromise();
      const userDBPromise = await mongoose
        .createConnection(env.mongoURI, {
          dbName: userDBName,
        })
        .asPromise();

      // 2. Consommer les promesses
      [movieDB, userDB] = await Promise.all([movieDBPromise, userDBPromise]);

      console.log("Connexion à mongoDB réussie !");
    }

    return { movieDB, userDB };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
