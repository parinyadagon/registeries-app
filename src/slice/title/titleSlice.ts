import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../store";

interface TitleState {
  value: string;
}

const initialState: TitleState = {
  value: "",
};

export const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setTitle } = titleSlice.actions;

export const selectTitle = (state: AppState) => state.title.value;

export default titleSlice.reducer;
