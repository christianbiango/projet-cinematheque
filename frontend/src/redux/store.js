import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./movies.reducer";
import usersReducer from "./users.reducer";

export default configureStore({
  reducer: {
    movies: moviesReducer,
    users: usersReducer,
  },
});
