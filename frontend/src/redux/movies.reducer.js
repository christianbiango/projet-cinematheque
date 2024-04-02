import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  totalMovies: null,
  currentPage: 1,
  loading: false,
  error: false,
};

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchFailure: (draft) => {
      draft.loading = false;
      draft.error = true;
    },

    /**
     * Cette méthode envoit les films récupérés en base de données dans le store. Déclenchée à chaque chargement de page
     */
    sendMovies: (draft, action) => {
      const { movies, totalMovies, currentPage, images } = action.payload;

      draft.loading = false;
      draft.data = movies;
      draft.images = images;
      draft.totalMovies = totalMovies;
      draft.currentPage =
        typeof currentPage === "number" ? currentPage : +currentPage;
    },
    resetMoviesSlice: (draft) => {
      draft.data = [];
      draft.totalMovies = null;
      draft.currentPage = 1;
      draft.loading = false;
      draft.error = false;
    },
  },
});

export const { fetchFailure, sendMovies, resetMoviesSlice } =
  moviesSlice.actions;
export default moviesSlice.reducer;
