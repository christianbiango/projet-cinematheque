import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
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
      draft.loading = false;
      draft.data = action.payload;
    },
  },
});

export const { fetchSuccess, fetchFailure, sendMovies } = moviesSlice.actions;
export default moviesSlice.reducer;
