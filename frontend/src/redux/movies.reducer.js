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
    fetchSuccess: (draft, action) => {
      draft.loading = false;
      draft.data = action.payload;
    },
    fetchFailure: (draft) => {
      draft.loading = false;
      draft.error = true;
    },
    sendMovies: (draft, action) => {
      const { movies, totalMovies, currentPage } = action.payload;
      draft.loading = false;
      draft.data = movies;
      draft.totalMovies = totalMovies;
      draft.currentPage =
        typeof currentPage === "number" ? currentPage : +currentPage;
    },
  },
});

export const { fetchSuccess, fetchFailure, sendMovies } = moviesSlice.actions;
export default moviesSlice.reducer;
