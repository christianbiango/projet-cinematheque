import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { movieSchema } from "./movie.model.js";
const { Schema, Types } = mongoose;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    role: { type: Number, require: true, default: 0 },
    localization: {
      adress: { type: String, require: false },
      city: { type: String, require: false },
      postal: { type: Number, require: false },
      country: { type: String, require: false },
    },
    filmList: [{ type: Schema.Types.ObjectId, ref: "movies" }],
    favouriteMovies: [{ type: Schema.Types.ObjectId, ref: "movies" }],
    likedMovies: [{ type: Schema.Types.ObjectId, ref: "movies" }],
    suggestedMovies: [{ type: Schema.Types.ObjectId, ref: "movies" }],
  },
  { timestamps: { createdAt: true } }
);

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model("User", userSchema);
