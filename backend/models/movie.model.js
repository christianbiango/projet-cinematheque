import mongoose from "mongoose";
import { env } from "../config/index.js";
import mongooseUniqueValidator from "mongoose-unique-validator";

const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    titre: {
      type: String,
      required: true,
      unique: true,
    },
    titreOriginal: {
      type: String,
    },
    realisateurs: {
      type: String,
      required: true,
    },
    anneeProduction: {
      type: Number,
      required: true,
    },
    nationalite: {
      type: String,
      required: true,
    },
    duree: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    synopsis: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true } }
);

movieSchema.plugin(mongooseUniqueValidator);

const Movie = mongoose.model(env.mongoMoviesCollectionName, movieSchema);

export default Movie;
