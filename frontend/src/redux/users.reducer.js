import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
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
  },
});

export const { fetchSuccess, fetchFailure } = userSlice.actions;
export default userSlice.reducer;
