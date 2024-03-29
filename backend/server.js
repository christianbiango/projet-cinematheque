import express from "express";
import { env } from "./config/index.js";
import mongoose from "mongoose";
import cors from "cors";

// Utils
import { saveMoviesToDB } from "./controllers/movie.controller.js";
import { countDBMovies, watchExcelFiles } from "./utils/movie.helper.js";

// ROUTER
import movieRouter from "./router/movie.router.js";
// APP EXPRESS
const app = express();

// PORT
const PORT = env.port;

// BDD MONGOOSE
mongoose
  .connect(env.mongoURI, { dbName: env.mongoDBName })
  .then(() => console.log("Connexion à mongoDB réussie !"))
  .catch((error) => console.log(error));

// MIDDLEWARE
app.use(express.json()); //  Pour parser les données envoyées dans le body de la requête (en format JSON).
app.use(cors()); // cors rend accessible l'API aux  clients situés sur des addresses web différentes

// MIDDLEWARE D'ERREURS
app.use((req, res, next) => {
  res.status(404).send("Page non trouvée");
});

app.use((err, req, res, next) => {
  console.log("Erreur :", err.message);

  // Remonter une réponse d'erreur côté client
  res.status(500).send("Une erreur est survenue au niveau du serveur");
});

// PREFIX ROUTES
app.use("/api/movies", movieRouter);

app.listen(PORT, () => {
  console.log(`LISTENING AT http://localhost:${PORT}`);
  // Au lancement du serveur, on réimporte les films car il y a pu avoir des modifications entre temps
  saveMoviesToDB();
  watchExcelFiles();
});
