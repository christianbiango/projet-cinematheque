import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seenMovies: [],
  favouriteMovies: [],
  seeLaterMovies: [],
  totalseenMovies: null,
  totalFavoriteMovies: null,
  totalSeeLaterMovies: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchSuccess: (draft, action) => {
      draft.loading = false;
      draft.data = action.payload;
    },
    fetchFailure: (draft) => {
      draft.loading = false;
      draft.error = true;
    },
    /**
     * Cette méthode envoit dans le store les préférences de films associées à un utilisateur, récupérées en base de données.
     *
     *  Déclenchée à chaque chargement de page
     */
    sendMoviesPreferences: (draft, action) => {
      const { seenMovies, favouriteMovies, seeLaterMovies } = action.payload;
      draft.seenMovies = seenMovies;
      draft.favouriteMovies = favouriteMovies;
      draft.seeLaterMovies = seeLaterMovies;

      draft.totalseenMovies = seenMovies.length;
      draft.totalFavoriteMovies = favouriteMovies.length;
      draft.totalSeeLaterMovies = seeLaterMovies.length;
    },
    /**
     * Cette méthode envoit dans le store les préférences de films associées à un utilisateur, récupérées en base de données.
     *
     * Déclenchée à chaque modifcation de préférence
     */
    sendMoviePreference: (draft, action) => {
      const { data, patchKeyName } = action.payload;
      draft[patchKeyName] = data;
    },
    resetUsersSlice: (draft) => {
      draft.seenMovies = [];
      draft.favouriteMovies = [];
      draft.seeLaterMovies = [];
      (draft.totalFavoriteMovies = null), (draft.totalseenMovies = null);
      draft.totalSeeLaterMovies = null;
      draft.loading = false;
      draft.error = false;
    },
  },
});

export const {
  fetchSuccess,
  fetchFailure,
  sendMoviesPreferences,
  resetUsersSlice,
  sendMoviePreference,
} = userSlice.actions;
export default userSlice.reducer;
