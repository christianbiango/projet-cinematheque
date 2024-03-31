import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { connectDatabases } from "../database/database.conn.js";
import { env } from "../config/index.js";

const { Schema, Types } = mongoose;

const getUserModel = async () => {
  try {
    const modelName = env.mongoUsersCollectionName;
    const moviesDBName = env.mongoMoviesDBName;

    const { userDB } = await connectDatabases();

    if (!userDB.modelNames().includes(modelName)) {
      const userSchema = new Schema(
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
          filmList: [
            { type: Schema.Types.ObjectId, ref: `${moviesDBName}.movies` },
          ],
          favouriteMovies: [
            { type: Schema.Types.ObjectId, ref: `${moviesDBName}.movies` },
          ],
          likedMovies: [
            { type: Schema.Types.ObjectId, ref: `${moviesDBName}.movies` },
          ],
          seeLaterMovies: [
            { type: Schema.Types.ObjectId, ref: `${moviesDBName}.movies` },
          ],
        },
        { timestamps: { createdAt: true } }
      );

      userSchema.plugin(mongooseUniqueValidator);
      userDB.model(modelName, userSchema);
    }

    const User = userDB.model(modelName);
    return User;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getUserModel;
